import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../lib/db";
import { chats, messages, chunks } from "../lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import OpenAI from "openai";

const app = new Hono();

// Helper function to check if user is authenticated
const authGuard = async (c: any, next: any) => {
  const user = c.var.user;

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
};

// Create a new chat
app.post(
  "/",
  authGuard,
  zValidator(
    "json",
    z.object({
      title: z.string().min(1).max(255),
    })
  ),
  async (c) => {
    const user = c.var.user;

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { title } = await c.req.json();

    const [newChat] = await db
      .insert(chats)
      .values({
        id: crypto.randomUUID(),
        userId: user.id,
        title,
      })
      .returning();

    return c.json({ chat: newChat });
  }
);

// Get user's chats
app.get(
  "/",
  authGuard,
  async (c) => {
    const user = c.var.user;

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, user.id))
      .orderBy(desc(chats.createdAt));

    return c.json({ chats: userChats });
  }
);

// Get chat messages
app.get(
  "/:chatId/messages",
  authGuard,
  zValidator(
    "param",
    z.object({
      chatId: z.string().uuid(),
    })
  ),
  async (c) => {
    const user = c.var.user;

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { chatId } = c.req.param();

    // Verify chat belongs to user
    const [chat] = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, user.id)));

    if (!chat) {
      return c.json({ error: "Chat not found or unauthorized" }, 404);
    }

    const chatMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(desc(messages.createdAt));

    return c.json({ messages: chatMessages });
  }
);

// Send a message and get a response
app.post(
  "/:chatId/message",
  authGuard,
  zValidator(
    "param",
    z.object({
      chatId: z.string().uuid(),
    })
  ),
  zValidator(
    "json",
    z.object({
      content: z.string().min(1),
    })
  ),
  async (c) => {
    const user = c.var.user;

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { chatId } = c.req.param();
    const { content } = await c.req.json();

    // Verify chat belongs to user
    const [chat] = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, user.id)));

    if (!chat) {
      return c.json({ error: "Chat not found or unauthorized" }, 404);
    }

    // Save the user's message
    const [userMessage] = await db
      .insert(messages)
      .values({
        id: crypto.randomUUID(),
        chatId,
        userId: user.id,
        role: "user",
        content,
      })
      .returning();

    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // In a real RAG implementation, we would search for relevant document chunks
      // and include them in the context for the LLM
      let context = "";

      // For demonstration purposes, we'll look for chunks that contain the user's query
      // In a real implementation, we would use vector similarity search
      const relevantChunks = await db
        .select()
        .from(chunks)
        .where(
          and(
            eq(chunks.userId, user.id),
            sql`content LIKE '%${content}%'` // Simple text search for demo
          )
        )
        .limit(5);

      if (relevantChunks.length > 0) {
        context = "Context from documents:\n" +
          relevantChunks.map(chunk => chunk.content).join("\n---\n");
      }

      // Prepare messages for the LLM
      const messagesForLLM = [
        {
          role: "system" as const,
          content: `You are a helpful assistant. Use the following context from documents to answer the user's questions:\n\n${context}`
        },
        { role: "user" as const, content: content }
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messagesForLLM,
      });

      const aiResponse = completion.choices[0]?.message?.content || "I couldn't generate a response.";

      // Save the AI's response
      const [aiMessage] = await db
        .insert(messages)
        .values({
          id: crypto.randomUUID(),
          chatId,
          userId: user.id,
          role: "assistant",
          content: aiResponse,
        })
        .returning();

      return c.json({
        userMessage,
        aiMessage
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      return c.json({ error: "Failed to generate AI response" }, 500);
    }
  }
);

export default app;
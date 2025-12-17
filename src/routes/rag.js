import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../lib/db";
import { documents, chunks } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import * as mammoth from "mammoth";
const app = new Hono();
// Helper function to check if user is authenticated
const authGuard = async (c, next) => {
    const user = c.var.user;
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
};
// Process a document into chunks with embeddings
app.post("/process/:id", authGuard, zValidator("param", z.object({
    id: z.string().uuid(),
})), async (c) => {
    const user = c.var.user;
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    const { id } = c.req.param();
    // Verify document belongs to user
    const [doc] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, id));
    if (!doc || doc.userId !== user.id) {
        return c.json({ error: "Document not found or unauthorized" }, 404);
    }
    try {
        // Load the document based on its type
        let docs;
        const filePath = doc.localPath;
        if (!doc.localPath) {
            return c.json({ error: "Document path is missing" }, 400);
        }
        switch (doc.type) {
            case "pdf":
                {
                    const loader = new PDFLoader(doc.localPath);
                    docs = await loader.load();
                }
                break;
            case "docx":
                {
                    const fs = await import("fs");
                    const arrayBuffer = fs.readFileSync(doc.localPath).buffer;
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    docs = [{ pageContent: result.value, metadata: { source: doc.localPath } }];
                }
                break;
            case "txt":
                {
                    const loader = new TextLoader(doc.localPath);
                    docs = await loader.load();
                }
                break;
            default:
                return c.json({ error: "Unsupported document type" }, 400);
        }
        // Split the document into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await textSplitter.splitDocuments(docs);
        // Embed each chunk using OpenAI embeddings
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
        // Process each chunk and store in the database
        for (let i = 0; i < splitDocs.length; i++) {
            const chunk = splitDocs[i];
            const embedding = await embeddings.embedQuery(chunk.pageContent);
            await db.insert(chunks).values({
                id: crypto.randomUUID(),
                documentId: doc.id,
                userId: user.id,
                content: chunk.pageContent,
                chunkIndex: i,
                embedding: Buffer.from(new Uint8Array(embedding)),
                metadata: {
                    source: doc.name,
                    page: chunk.metadata.loc?.pageNumber || null,
                    section: chunk.metadata.source || null,
                },
            });
        }
        return c.json({
            success: true,
            chunksProcessed: splitDocs.length,
            document: doc
        });
    }
    catch (error) {
        console.error("Error processing document:", error);
        return c.json({ error: "Failed to process document" }, 500);
    }
});
// Search for relevant chunks
app.post("/search", authGuard, zValidator("json", z.object({
    query: z.string().min(1),
    topK: z.number().int().min(1).max(100).optional().default(5),
})), async (c) => {
    const user = c.var.user;
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    const { query, topK } = await c.req.json();
    try {
        // Create embeddings for the query
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
        const queryEmbedding = await embeddings.embedQuery(query);
        // In a real implementation, we would use a vector similarity search
        // Since we're using SQLite which doesn't support vector operations natively,
        // we'll use a simple text-based search approach for the example
        // In production, you might use a dedicated vector database like Pinecone or Supabase
        const relevantChunks = await db
            .select()
            .from(chunks)
            .where(eq(chunks.userId, user.id))
            .orderBy((t) => t.chunkIndex) // Simple ordering since we can't do vector similarity in SQLite
            .limit(topK);
        return c.json({ chunks: relevantChunks });
    }
    catch (error) {
        console.error("Error searching chunks:", error);
        return c.json({ error: "Failed to search chunks" }, 500);
    }
});
export default app;

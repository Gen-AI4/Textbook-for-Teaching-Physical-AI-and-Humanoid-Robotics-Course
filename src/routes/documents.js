import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../lib/db";
import { documents } from "../lib/db/schema";
import { eq } from "drizzle-orm";
const app = new Hono();
// Helper function to check if user is authenticated
const authGuard = async (c, next) => {
    const user = c.var.user;
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
};
// Upload a document
app.post("/upload", authGuard, async (c) => {
    const user = c.var.user;
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    const formData = await c.req.formData();
    const file = formData.get("file");
    if (!file) {
        return c.json({ error: "No file provided" }, 400);
    }
    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
        return c.json({ error: "Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed." }, 400);
    }
    // Create a unique file name
    const fileName = `${user.id}-${Date.now()}-${file.name}`;
    const filePath = `./uploads/${fileName}`;
    // In a real implementation, we would save the file to disk or S3
    // For now, we'll just store the file information in the database
    const [newDoc] = await db
        .insert(documents)
        .values({
        id: crypto.randomUUID(),
        userId: user.id,
        name: file.name,
        type: file.type.split("/")[1] || "unknown", // Extract extension from mime type
        storageType: "local",
        localPath: filePath,
        metadata: {
            size: file.size,
            uploadedAt: new Date().toISOString(),
        },
    })
        .returning();
    return c.json({ document: newDoc });
});
// Get user's documents
app.get("/", authGuard, async (c) => {
    const user = c.var.user;
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    const userDocs = await db
        .select()
        .from(documents)
        .where(eq(documents.userId, user.id));
    return c.json({ documents: userDocs });
});
// Delete a document
app.delete("/:id", authGuard, zValidator("param", z.object({
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
    // In a real implementation, we would also delete the actual file
    await db.delete(documents).where(eq(documents.id, id));
    return c.json({ success: true });
});
export default app;

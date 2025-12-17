import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import { auth } from "./lib/auth";
import authRoutes from "./routes/auth";
import documentRoutes from "./routes/documents";
import ragRoutes from "./routes/rag";
import chatRoutes from "./routes/chat";
const app = new Hono();
// Add logger middleware
app.use("*", logger());
// Apply auth middleware to all routes
app.use("/*", async (c, next) => {
    try {
        const session = await auth.api.getSession({
            headers: c.req.raw.headers,
        });
        if (session?.session) {
            c.set("user", session.user);
        }
    }
    catch (error) {
        // If session is invalid, continue without user
    }
    return next();
});
// Health check endpoint
app.get("/health", async (c) => {
    return c.json({ status: "OK", timestamp: new Date().toISOString() });
});
// API routes - these will be matched before static file serving for these specific paths
app.route("/api/auth", authRoutes);
app.route("/api/documents", documentRoutes);
app.route("/api/rag", ragRoutes);
app.route("/api/chat", chatRoutes);
// Catch-all for frontend routes - serve static files after API routes are checked
app.get("/*", serveStatic({ root: "./build" }));
// For the root path specifically as well
app.get("/", serveStatic({ root: "./build", path: "./index.html" }));
export default app;

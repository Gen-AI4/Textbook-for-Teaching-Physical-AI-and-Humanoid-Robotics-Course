import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth } from "./src/lib/auth";
import authRoutes from "./src/routes/auth";
import documentRoutes from "./src/routes/documents";
import ragRoutes from "./src/routes/rag";
import chatRoutes from "./src/routes/chat";

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
  } catch (error) {
    // If session is invalid, continue without user
  }

  return next();
});

// Health check endpoint
app.get("/health", async (c) => {
  return c.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.route("/api/auth", authRoutes);
app.route("/api/documents", documentRoutes);
app.route("/api/rag", ragRoutes);
app.route("/api/chat", chatRoutes);

export default app;
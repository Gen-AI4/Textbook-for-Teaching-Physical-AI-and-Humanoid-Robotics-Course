import { Hono } from "hono";

const middleware = new Hono();

// This middleware is now handled globally in src/index.ts
// No need to add specific auth handling here

export default middleware;
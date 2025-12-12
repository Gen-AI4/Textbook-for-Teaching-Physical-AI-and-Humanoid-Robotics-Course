// api/functions/health.ts
import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono();

// Add logger middleware
app.use('*', logger());

// Health check endpoint
app.get('/', async (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
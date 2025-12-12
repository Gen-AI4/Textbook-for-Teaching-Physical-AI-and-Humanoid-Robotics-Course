// api/functions/index.ts
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import authRoutes from '../../src/routes/auth';
import documentRoutes from '../../src/routes/documents';
import ragRoutes from '../../src/routes/rag';
import chatRoutes from '../../src/routes/chat';
import { auth } from '../../src/lib/auth';

const app = new Hono();

// Add logger middleware
app.use('*', logger());

// Apply auth middleware to all routes
app.use('/*', async (c: any, next: any) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (session?.session) {
      c.set('user', session.user);
    }
  } catch (error) {
    // If session is invalid, continue without user
  }

  return next();
});

// Health check endpoint
app.get('/health', async (c: any) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.route('/auth', authRoutes);
app.route('/documents', documentRoutes);
app.route('/rag', ragRoutes);
app.route('/chat', chatRoutes);

export default app;
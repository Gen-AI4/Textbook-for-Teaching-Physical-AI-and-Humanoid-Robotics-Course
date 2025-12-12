// api/rag/index.ts
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import ragRoutes from '../../src/routes/rag';
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

// Mount RAG routes
app.route('/', ragRoutes);

// Handle the request in Vercel
export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  return handleRequest(request);
}

export async function PUT(request: Request) {
  return handleRequest(request);
}

export async function DELETE(request: Request) {
  return handleRequest(request);
}

async function handleRequest(request: Request) {
  // Convert the incoming request to work with Hono
  const response = await app.fetch(request);
  return response;
}

export default app;
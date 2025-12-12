import { NextRequest } from 'next/server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import authRoutes from '../../../src/routes/auth';
import documentRoutes from '../../../src/routes/documents';
import ragRoutes from '../../../src/routes/rag';
import chatRoutes from '../../../src/routes/chat';
import { auth } from '../../../src/lib/auth';

// Create a Hono app that will handle the API requests
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

// Vercel Edge Function handler
export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, ''); // Remove /api prefix

  // Convert NextRequest to a format Hono can handle
  const honoRequest = new Request(`${request.nextUrl.origin}${path}${url.search}`, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  // Use the Hono app to handle the request
  const response = await app.fetch(honoRequest);

  return response;
}
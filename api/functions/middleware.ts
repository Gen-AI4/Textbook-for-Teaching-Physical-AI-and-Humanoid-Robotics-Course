// api/functions/middleware.ts
import { NextRequest } from 'next/server';
import app from './index';

export async function handleRequest(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/functions/, ''); // Remove /api/functions prefix
  
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

// Vercel Edge Function handlers
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

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
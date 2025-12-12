// api/index.ts
export async function GET() {
  return new Response(
    JSON.stringify({ message: 'API is running', timestamp: new Date().toISOString() }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export default function handler() {
  // This is needed for Vercel
}
// api/health.ts
export async function GET() {
  return new Response(
    JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }),
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
import { serve } from "@hono/node-server";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import path module to handle file paths
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import app from "./vercel-api";
const port = parseInt(process.env.PORT || "3000");
console.log(`Vercel server listening on port ${port}`);
// Export the handler for Vercel
export default async function handler(request) {
    return app.fetch(request);
}
// Also keep the server for local development
if (process.env.NODE_ENV !== 'production') {
    serve({
        fetch: app.fetch,
        port,
    }, (info) => {
        console.log(`Local server is running on http://0.${process.env.HOST || '0.0.0.0'}:${info.port}`);
    });
}

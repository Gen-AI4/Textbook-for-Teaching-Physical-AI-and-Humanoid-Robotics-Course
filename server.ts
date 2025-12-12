import { serve } from "@hono/node-server";
import app from "./src/index";

// For Vercel deployment, we define the port but the actual serving
// of static files is handled by Vercel's CDN and the /api routes
// are handled by the edge functions
const port = parseInt(process.env.PORT || "3000");

console.log(`Server listening on port ${port}`);

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Server is running on http://${process.env.HOST || '0.0.0.0'}:${info.port}`);
});
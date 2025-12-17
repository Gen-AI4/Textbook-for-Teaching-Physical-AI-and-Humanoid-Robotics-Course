import { serve } from "@hono/node-server";
import app from "./src/index";
// For Vercel deployment
const port = parseInt(process.env.PORT || "3000");
console.log(`Server listening on port ${port}`);
serve({
    fetch: app.fetch,
    port,
}, (info) => {
    console.log(`Server is running on http://${process.env.HOST || '0.0.0.0'}:${info.port}`);
});

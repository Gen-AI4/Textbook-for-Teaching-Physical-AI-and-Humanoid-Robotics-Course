import { serve } from "@hono/node-server";
import app from "./src/index";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const host = process.env.HOST || "0.0.0.0";
console.log(`Server is running on port ${port}`);
serve({
    fetch: app.fetch,
    port,
}, (info) => {
    console.log(`Server is running on http://0.0.0.0:${info.port}`);
});

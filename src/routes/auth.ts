import { Hono } from "hono";
import { db } from "../lib/db";
import { eq } from "drizzle-orm";
import { extendedUsers } from "../lib/db/schema";
import { auth } from "../lib/auth";

const app = new Hono();

app.get("/session", (c) => {
  const user = c.var.user;
  if (user) {
    return c.json({ user });
  } else {
    return c.json({ user: null });
  }
});

// Additional user profile routes that need authentication
app.get("/profile", async (c) => {
  const user = c.var.user;

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get extended user information
  const [extendedUser] = await db
    .select()
    .from(extendedUsers)
    .where(eq(extendedUsers.id, user.id));

  return c.json({ user: extendedUser });
});

app.put("/profile", async (c) => {
  const user = c.var.user;

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { firstName, lastName, bio, username } = await c.req.json();

  // Update user profile
  await db
    .update(extendedUsers)
    .set({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      bio: bio || user.bio,
      username: username || user.username,
      onboarded: true,
    })
    .where(eq(extendedUsers.id, user.id));

  return c.json({ success: true });
});

export default app;
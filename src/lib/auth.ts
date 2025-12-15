import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customUserMetadata, extendedUsers } from "./db/schema";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  secret: process.env.AUTH_SECRET || "secret",
  trustUserPassword: true,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    // Add additional fields for onboarding
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      profilePicture: {
        type: "string", // Changed from "file" to "string" as "file" may not be supported
        required: false,
      },
      onboarded: {
        type: "boolean",
        required: false,
        default: false,
      },
      username: {
        type: "string",
        required: false,
      }
    }
  }
});
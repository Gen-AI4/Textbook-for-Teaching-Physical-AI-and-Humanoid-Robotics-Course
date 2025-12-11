import { betterAuth } from "../../node_modules/better-auth/dist/index.js";
import { drizzleAdapter } from "../../node_modules/better-auth/dist/adapters/drizzle.js";
import { extendedUsers } from "./db/schema";
import { db } from "./db";
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        // Use our extended user schema
        user: extendedUsers,
        // We don't need to map account separately since we're using customUserMetadata table
    }),
    plugins: [
        // Add the username plugin
        {
            $id: "username",
            user: {
                $create: {
                    input: {
                        username: "string",
                    },
                    schema: {
                        username: "string",
                    },
                },
            },
        },
        // Add additional fields for onboarding
        {
            $id: "onboarding-fields",
            user: {
                $create: {
                    input: {
                        firstName: "string",
                        lastName: "string",
                        bio: "string",
                        profilePicture: "file",
                        onboarded: "boolean",
                    },
                    schema: {
                        firstName: "string",
                        lastName: "string",
                        bio: "string",
                        profilePicture: "file",
                        onboarded: "boolean",
                    },
                },
                $update: {
                    input: {
                        firstName: "string?",
                        lastName: "string?",
                        bio: "string?",
                        profilePicture: "file?",
                        onboarded: "boolean?",
                    },
                    schema: {
                        firstName: "string?",
                        lastName: "string?",
                        bio: "string?",
                        profilePicture: "file?",
                        onboarded: "boolean?",
                    },
                },
            },
        },
    ],
    secret: process.env.AUTH_SECRET || "secret",
    trustUserPassword: true,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
});

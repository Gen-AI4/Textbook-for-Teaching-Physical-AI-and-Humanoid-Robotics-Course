import { DefaultSession } from "better-auth";

declare module "hono" {
  interface ContextVariableMap {
    user: DefaultSession["user"];
  }
}
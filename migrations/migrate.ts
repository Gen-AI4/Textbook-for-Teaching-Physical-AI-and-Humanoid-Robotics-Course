import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "../src/lib/db";

// This will run migrations on the database
migrate(db, { migrationsFolder: "./drizzle" });

console.log("Migrations complete!");
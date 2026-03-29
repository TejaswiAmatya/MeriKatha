import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Strip sslmode from URL — pg v8 treats sslmode=require as verify-full,
// which conflicts with Supabase's self-signed cert. We handle SSL via the pool option.
const connectionString = process.env.DATABASE_URL!.replace(
  /[?&]sslmode=[^&]*/,
  (match) => (match.startsWith("?") ? "?" : "")
).replace(/\?$/, "");

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

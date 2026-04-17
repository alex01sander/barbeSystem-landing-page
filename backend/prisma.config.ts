// Prisma 7 config
// ─────────────────────────────────────────────────────────────────────
//  DIRECT_URL  (porta 5432) → usado pelo CLI: migrate deploy, db push
//  DATABASE_URL (porta 6543) → usado pelo PrismaClient em runtime
//
//  O pgBouncer bloqueia DDL, por isso o CLI deve usar a conexão direta.
// ─────────────────────────────────────────────────────────────────────
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // CLI usa a conexão direta (sem pgBouncer) para executar migrations
    url: process.env["DIRECT_URL"]!,
  },
});


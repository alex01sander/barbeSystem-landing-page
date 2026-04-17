import { PrismaClient } from "../../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

// Validar se DATABASE_URL está presente
if (!process.env.DATABASE_URL) {
  throw new Error("A variável de ambiente DATABASE_URL é obrigatória.");
}

// Configurar o pool do driver 'pg'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Ajustes recomendados para Supabase/PgBouncer
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Criar o adapter do Prisma para PostgreSQL
const adapter = new PrismaPg(pool);

// Instanciar o PrismaClient com o adapter
const prisma = new PrismaClient({ adapter });

export { prisma };

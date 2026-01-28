import { PrismaClient } from "@prisma/client";
/**
 * INSTÂNCIA DO PRISMA CLIENT
 *
 * RECEBE A URL DO BANCO NA INSTâNCIA!
 */
export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL!,
});
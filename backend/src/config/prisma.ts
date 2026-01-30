import { PrismaClient } from "@prisma/client";
/**
 * Instância o PrismaClient recebemndo como objeto a variável do banco de dados.
 */
export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL!,
});
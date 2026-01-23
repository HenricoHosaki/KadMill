import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // Use o "!" aqui também
  datasourceUrl: process.env.DATABASE_URL!, 
});

export default prisma;
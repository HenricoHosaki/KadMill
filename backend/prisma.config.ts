import { defineConfig } from '@prisma/config';

export default defineConfig({
  // Altere de um objeto para apenas a string "classic"
  engine: 'classic', 
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
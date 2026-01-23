import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
export default defineConfig({
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
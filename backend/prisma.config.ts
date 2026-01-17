import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
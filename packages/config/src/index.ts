import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const envSchema = z.object({
  // General
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  JWT_SECRET: z.string().min(10),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis / BullMQ
  REDIS_URL: z.string().url().optional(),

  // External APIs
  OPENROUTER_API_KEY: z.string().optional(),
  OLLAMA_URL: z.string().url().optional(),

  // Socials / Drive
  GOOGLE_DRIVE_CLIENT_ID: z.string().optional(),
  GOOGLE_DRIVE_CLIENT_SECRET: z.string().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  META_ACCESS_TOKEN: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;

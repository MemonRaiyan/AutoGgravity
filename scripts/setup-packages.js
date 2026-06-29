const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Config Package
const configDir = path.join(packagesDir, 'config');
ensureDir(configDir);
ensureDir(path.join(configDir, 'src'));

fs.writeFileSync(path.join(configDir, 'package.json'), JSON.stringify({
  name: "@autogravity/config",
  version: "1.0.0",
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: {
    "build": "tsc",
    "dev": "tsc -w"
  },
  dependencies: {
    "zod": "^3.23.8",
    "dotenv": "^16.4.5"
  },
  devDependencies: {
    "typescript": "^5.5.4"
  }
}, null, 2));

fs.writeFileSync(path.join(configDir, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: "es2022",
    module: "commonjs",
    declaration: true,
    outDir: "./dist",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true
  },
  include: ["src/**/*"]
}, null, 2));

fs.writeFileSync(path.join(configDir, 'src', 'env.ts'), `import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().default("super_secret_jwt_key_for_dev_only"),
  JWT_REFRESH_SECRET: z.string().default("super_secret_refresh_key_for_dev_only"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
`);

fs.writeFileSync(path.join(configDir, 'src', 'index.ts'), `export * from "./env";\n`);


// 2. Shared Package
const sharedDir = path.join(packagesDir, 'shared');
ensureDir(sharedDir);
ensureDir(path.join(sharedDir, 'src'));

fs.writeFileSync(path.join(sharedDir, 'package.json'), JSON.stringify({
  name: "@autogravity/shared",
  version: "1.0.0",
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: {
    "build": "tsc",
    "dev": "tsc -w"
  },
  dependencies: {
    "winston": "^3.14.2"
  },
  devDependencies: {
    "typescript": "^5.5.4",
    "@types/node": "^22.0.0"
  }
}, null, 2));

fs.writeFileSync(path.join(sharedDir, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: "es2022",
    module: "commonjs",
    declaration: true,
    outDir: "./dist",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true
  },
  include: ["src/**/*"]
}, null, 2));

ensureDir(path.join(sharedDir, 'src', 'logger'));
fs.writeFileSync(path.join(sharedDir, 'src', 'logger', 'index.ts'), `import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return \`\${timestamp} \${level}: \${stack || message}\`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'autogravity' },
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        logFormat
      )
    })
  ]
});
`);

fs.writeFileSync(path.join(sharedDir, 'src', 'index.ts'), `export * from "./logger";\n`);

console.log("Packages configured.");

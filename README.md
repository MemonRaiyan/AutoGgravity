# AutoGravity AI

AutoGravity AI is an enterprise-grade automation platform that streamlines the process of fetching videos from Google Drive and distributing them across multiple social media channels (YouTube Shorts, Instagram Reels, Facebook Reels) leveraging AI for metadata generation.

---

## Architecture

AutoGravity AI uses a modern, modular Monorepo architecture built with Turborepo, Next.js 15, and Node.js.

\`\`\`mermaid
graph TD
  subgraph Frontend
    D[Dashboard - Next.js]
  end

  subgraph Packages
    UI[UI Components]
    Shared[Shared/Logger]
    Config[Config/Zod]
  end

  subgraph Backend
    API[Express API]
    Worker[BullMQ Workers]
  end

  subgraph Infrastructure
    DB[(PostgreSQL)]
    Redis[(Redis)]
  end

  D --> API
  D -.-> UI
  D -.-> Config
  API -.-> Shared
  API -.-> Config
  Worker -.-> Shared
  API --> DB
  API --> Redis
  Worker --> Redis
  Worker --> DB
\`\`\`

## Features

- **Multi-Platform Support**: YouTube, Meta (Instagram/Facebook), Telegram.
- **AI Automation**: Dynamic prompt generation for titles, descriptions, and tags.
- **Job Queuing**: Robust distributed job queuing via BullMQ & Redis.
- **Modular Monorepo**: Dedicated `@autogravity/ui`, `@autogravity/config`, and `@autogravity/shared` packages.
- **Dark Mode**: fully responsive, mobile-first SaaS dashboard using `shadcn/ui` and Tailwind v4.

---

## Installation & Setup

### Prerequisites
- Node.js >= 20.x
- Docker & Docker Compose
- npm >= 10.x

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-org/autogravity-ai.git
cd autogravity-ai
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Copy the example environment files for both API and Dashboard.
*(Ensure `DATABASE_URL` and `REDIS_URL` point to the local Docker instances for development)*

### 4. Start Infrastructure (PostgreSQL & Redis)
\`\`\`bash
docker-compose up -d postgres redis
\`\`\`

### 5. Database Migrations
Generate the Prisma client and push the schema to PostgreSQL:
\`\`\`bash
cd database
npx prisma generate
npx prisma db push
\`\`\`

### 6. Start Development Servers
Run the full monorepo in development mode using Turborepo:
\`\`\`bash
npm run dev
\`\`\`
- **Dashboard**: http://localhost:3000
- **API Server**: http://localhost:4000
- **Swagger Docs**: http://localhost:4000/api-docs

---

## Docker (Production)

To run the entire platform via Docker in production:
\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d --build
\`\`\`
This provisions health-checked containers for PostgreSQL, Redis, API, and the Next.js Dashboard.

---

## Roadmap

- **Module 1A**: Foundation, Database Design, Modular Architecture, UI Package. *(Completed)*
- **Module 1B**: Complete Authentication flow, User Roles, Settings.
- **Module 2**: Google Drive Integration & Social Media OAuth.
- **Module 3**: AI Processing & Metadata Pipeline.
- **Module 4**: BullMQ Worker Implementation & Auto-Uploads.

---

*Built for scalability, engineered with precision.*

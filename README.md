# AutoGravity AI

AutoGravity AI is an automated platform for uploading videos from Google Drive to multiple social media platforms (YouTube, Meta, Telegram) utilizing AI for content processing.

## 🚀 Features
- **Clean Architecture**: Monorepo using npm workspaces & Turborepo.
- **Frontend**: Next.js 15, TailwindCSS, shadcn/ui.
- **Backend**: Express, TypeScript, Prisma (SQLite).
- **Docker Ready**: Multi-stage Dockerfiles and compose setups.

## 📁 Project Structure
\`\`\`
autogravity-ai/
├── apps/
│   ├── api/          # Express API server
│   └── dashboard/    # Next.js 15 Admin Dashboard
├── packages/
│   ├── config/       # Shared environment & Zod schemas
│   ├── shared/       # Shared utils
│   ├── types/        # Shared TypeScript interfaces
│   └── ui/           # Shared UI configs
├── database/         # Prisma schema and SQLite db
├── docker/           # Dev Dockerfiles
└── scripts/          # Workspace utilities
\`\`\`

## 🛠️ Installation

1. **Clone the repository** (if applicable):
   \`\`\`bash
   git clone <repo-url>
   cd autogravity-ai
   \`\`\`

2. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Database Setup**:
   \`\`\`bash
   cd database
   npx prisma db push
   npx prisma generate
   cd ..
   \`\`\`

## 💻 Development

Run the entire monorepo in development mode using Turborepo:
\`\`\`bash
npm run dev
\`\`\`
- **Dashboard**: http://localhost:3000
- **API**: http://localhost:4000/health

## 🐳 Docker

Start the development environment using Docker Compose:
\`\`\`bash
docker-compose up --build
\`\`\`

For production:
\`\`\`bash
docker-compose -f docker-compose.prod.yml up --build -d
\`\`\`

## 🗺️ Roadmap
- [ ] Phase 1A: Foundation Setup (Completed)
- [ ] Phase 1B: Authentication & Database Seed
- [ ] Phase 2: Google Drive & Social Media Integrations
- [ ] Phase 3: AI Processing (OpenRouter/Ollama)
- [ ] Phase 4: Job Queues & Scheduling (BullMQ/Redis)

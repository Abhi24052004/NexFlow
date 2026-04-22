# NexFlow

**NexFlow** is a low-code workflow automation platform that enables users to design, execute, and monitor complex automation pipelines through an intuitive node-based editor. Connect webhooks, AI models, and messaging platforms without writing code.

[![Built with Next.js](https://img.shields.io/badge/built%20with-Next.js%2015-black?style=flat-square)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Workflow Nodes](#workflow-nodes)
- [Usage Guide](#usage-guide)
  - [Creating a Workflow](#creating-a-workflow)
  - [Webhook Integration](#webhook-integration)
  - [Credential Management](#credential-management)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Capabilities

- **📊 Node-Based Workflow Editor** — Visual interface powered by React Flow with real-time graph editing
- **🔄 Multi-Trigger Support** — Manual triggers, webhooks (Gmail, Google Forms, Google Sheets), HTTP requests
- **🤖 AI Integration** — OpenAI, Anthropic Claude, Google Gemini with context preservation across workflow steps
- **💬 Messaging Support** — Native Slack and Discord integrations for notifications and messaging
- **🔐 Secure Credential Management** — Encrypted API keys and secrets scoped to user accounts
- **⚡ Async Execution Engine** — Event-driven orchestration with Inngest for reliable, scalable task execution
- **📈 Execution Tracking** — Monitor workflow runs with detailed logs, timing, and error diagnostics
- **👥 Multi-Tenancy** — Full user isolation with OAuth2 (GitHub, Google) and email/password auth
- **🎨 Premium Tiers** — Subscription-ready with Polar.sh integration for checkout and customer portal

### Extensibility

- Plugin-based executor architecture for easy node type addition
- Typed tRPC procedures for safe client-server communication
- Topologically-sorted execution ensures dependency satisfaction
- Context propagation through the entire workflow pipeline

---

## Architecture Overview

NexFlow follows a **three-tier architecture** with a **decoupled execution engine**:

```
┌─────────────────────────────────────────────────────┐
│                    Browser / UI Layer                │
│         (Next.js React App, Tailwind, Radix)       │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│               API & Business Logic                   │
│  (tRPC, Auth Module, Workflow Routers)             │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    PostgreSQL    Inngest Worker   External APIs
    (Prisma)      (Async Exec)     (AI, Messaging)
```

**Key Design Principles:**
- User data is scoped by authenticated user ID throughout
- Credentials are encrypted at-rest in the database
- Workflows are persisted as DAGs (directed acyclic graphs)
- Execution is fully asynchronous via event queue
- Real-time status updates via Inngest Realtime channels

---

## Tech Stack

### Frontend & BFF
- **Next.js 15** — App Router, Server Components, API Routes
- **React 19** — Modern JSX with automatic batching
- **TypeScript 5** — End-to-end type safety
- **Tailwind CSS v4** — Utility-first styling
- **Radix UI** — Headless, accessible component primitives
- **React Flow 12** — Node-based graph editor
- **React Hook Form** — Performant form state management
- **TanStack Query** — Async server state management

### Backend & API
- **tRPC 11** — Type-safe, composable API layer
- **Better Auth** — Modern authentication with social login
- **Zod** — Runtime schema validation and type inference
- **Polar** — Subscription and billing integration

### Data & Persistence
- **Prisma 7** — ORM with PostgreSQL adapter
- **PostgreSQL** — Relational database
- **Prisma Migrations** — Version-controlled schema

### Event Orchestration & Workers
- **Inngest** — Event-driven, serverless workflow execution
- **Inngest Realtime** — WebSocket channels for live status updates

### AI & External Integrations
- **Vercel AI SDK** — Unified interface for LLMs
  - Google Gemini
  - OpenAI (GPT-4, etc.)
  - Anthropic Claude
- **Gmail API** — Email trigger webhooks
- **Google Forms & Sheets APIs** — Form response and spreadsheet triggers
- **Slack API** — Message posting
- **Discord API** — Webhook notifications

### Developer Experience
- **Biome** — Fast linter and code formatter
- **tsx** — TypeScript executor for Node.js
- **mprocs** — Multi-process runner for local dev
- **ngrok** — Secure webhook tunneling for local testing

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **PostgreSQL** ≥ 14.x (local or remote)
- **Git**
- OAuth app credentials (GitHub, Google) for social login

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/nexflow.git
   cd nexflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Generate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

### Configuration

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in required environment variables:**
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/nexflow_dev"
   
   # App URLs
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # OAuth - GitHub
   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"
   
   # OAuth - Google
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   
   # Billing (Polar)
   POLAR_API_KEY="your_polar_api_key"
   POLAR_SUCCESS_URL="http://localhost:3000/dashboard"
   
   # AI Providers
   OPENAI_API_KEY="sk-..."
   ANTHROPIC_API_KEY="sk-ant-..."
   GOOGLE_GENERATIVE_AI_API_KEY="AIza..."
   
   # Inngest (for webhook tunneling during dev)
   INNGEST_EVENT_KEY="evt_..."
   INNGEST_SIGNING_KEY="sig_..."
   
   # Optional: ngrok for local webhook testing
   NGROK_TOKEN="your_ngrok_token"
   ```

3. **Set up OAuth applications:**

   **GitHub:**
   - Go to https://github.com/settings/developers
   - Create a new OAuth App
   - Authorization callback: `http://localhost:3000/api/auth/callback/github`

   **Google:**
   - Go to https://console.cloud.google.com/
   - Create OAuth 2.0 credentials (Web application)
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### Running Locally

1. **Set up the database:**
   ```bash
   npx prisma migrate dev
   # This will apply all migrations and seed if configured
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

3. **(Optional) Start all services with mprocs:**
   ```bash
   npm run dev:all
   # Runs: Next.js dev server + Inngest CLI
   ```

4. **(Optional) Tunnel for webhook testing:**
   ```bash
   npm run ngrok:dev
   # Exposes local server to the internet for webhooks
   ```

---

## Project Structure

```
nexflow/
├── prisma/
│   ├── schema.prisma           # Data model definition
│   ├── seed.ts                 # Database seeding (optional)
│   └── migrations/             # Versioned schema changes
├── public/
│   └── logos/                  # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/             # Auth pages (login, signup)
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   ├── (editor)/       # Workflow editor
│   │   │   └── (rest)/         # Dashboard sections (workflows, executions, credentials)
│   │   ├── api/
│   │   │   ├── auth/           # Better Auth endpoints
│   │   │   ├── trpc/           # tRPC handler
│   │   │   ├── inngest/        # Inngest webhook handler
│   │   │   └── webhooks/       # Trigger webhooks (Gmail, Forms, Sheets)
│   │   ├── client.tsx          # Global client wrapper
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Radix + shadcn components
│   │   ├── react-flow/         # Custom Flow nodes (editor UI)
│   │   ├── app-header.tsx      # Navigation header
│   │   ├── app-sidebar.tsx     # Navigation sidebar
│   │   ├── workflow-node.tsx   # Node representation in editor
│   │   └── ...
│   ├── config/
│   │   ├── constants.ts        # App constants (pagination, etc.)
│   │   └── node-components.ts  # Node type metadata
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Authentication UI
│   │   ├── credentials/        # Credential CRUD
│   │   │   └── server/         # Encrypted secret management
│   │   ├── workflows/          # Workflow CRUD and editor
│   │   │   └── server/         # Workflow persistence routers
│   │   ├── executions/         # Execution history and monitoring
│   │   │   ├── components/     # Executor implementations
│   │   │   │   ├── gemini/
│   │   │   │   ├── openai/
│   │   │   │   ├── anthropic/
│   │   │   │   ├── http-request/
│   │   │   │   ├── discord/
│   │   │   │   └── slack/
│   │   │   ├── lib/
│   │   │   │   └── executor-registry.ts  # Node type → executor mapping
│   │   │   └── server/         # Execution history routers
│   │   ├── triggers/           # Trigger node implementations
│   │   │   └── components/
│   │   │       ├── manual-trigger/
│   │   │       ├── gmail-trigger/
│   │   │       ├── google-form-trigger/
│   │   │       └── google-sheet-trigger/
│   │   └── subscriptions/      # Premium tier management (Polar)
│   ├── generated/
│   │   └── prisma/             # Prisma client (auto-generated)
│   ├── hooks/
│   │   ├── use-mobile.ts       # Responsive design hook
│   │   ├── use-entity-search.tsx
│   │   └── use-upgrade-modal.tsx
│   ├── inngest/
│   │   ├── client.ts           # Inngest client setup
│   │   ├── functions.ts        # Main workflow executor function
│   │   ├── utils.ts            # Topological sort, event dispatch
│   │   └── channels/           # Real-time status channels
│   │       ├── gemini.ts
│   │       ├── openai.ts
│   │       ├── anthropic.ts
│   │       ├── slack.ts
│   │       ├── discord.ts
│   │       ├── manual-trigger.ts
│   │       ├── gmail-trigger.ts
│   │       ├── google-form-trigger.ts
│   │       └── google-sheet-trigger.ts
│   ├── lib/
│   │   ├── auth.ts             # Better Auth instance
│   │   ├── auth-client.ts      # Client-side auth utilities
│   │   ├── auth-utils.ts       # Helpers (role checks, etc.)
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── encryption.ts       # Credential encryption/decryption
│   │   ├── polar.ts            # Polar SDK initialization
│   │   └── utils.ts            # General utilities
│   └── trpc/
│       ├── init.ts             # tRPC router initialization + protected procedures
│       ├── client.tsx          # Client-side tRPC setup
│       ├── server.tsx          # Server-side helpers
│       ├── query-client.ts     # TanStack Query configuration
│       └── routers/
│           └── _app.ts         # Root router combining all domain routers
├── docs/                       # Documentation (optional)
├── .env.example                # Template environment variables
├── .env.local                  # Local environment (gitignored)
├── biome.json                  # Linter & formatter config
├── components.json             # shadcn/ui metadata
├── next.config.ts              # Next.js config
├── postcss.config.mjs          # PostCSS + Tailwind config
├── prisma.config.ts            # Prisma configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

---

## Workflow Nodes

Each node in a workflow has a **type** and optional **data** configuration. Nodes are connected via **edges** (connections) that define execution order and data flow.

### Trigger Nodes (Workflow Start Points)

| Node Type | Purpose | Input | Output |
|-----------|---------|-------|--------|
| **INITIAL** | Placeholder/manual start | None | Pass-through |
| **MANUAL_TRIGGER** | User-initiated execution | None | Empty context |
| **GMAIL_TRIGGER** | Email received | Webhook data | `{ gmail: {...} }` |
| **GOOGLE_FORM_TRIGGER** | Form response submitted | Webhook data | `{ googleForm: {...} }` |
| **GOOGLE_SHEET_TRIGGER** | Row added to sheet | Webhook data | `{ googleSheet: {...} }` |
| **HTTP_REQUEST** | External API call | URL, headers, method, body | JSON response |

### AI Nodes (LLM Processing)

| Node Type | Provider | Config | Output |
|-----------|----------|--------|--------|
| **GEMINI** | Google | Model, temperature, prompt template | Generated text |
| **OPENAI** | OpenAI | Model, temperature, system prompt | Generated text |
| **ANTHROPIC** | Anthropic | Model, temperature, thinking budget | Generated text |

### Output Nodes (Workflow End Points)

| Node Type | Service | Config | Behavior |
|-----------|---------|--------|----------|
| **SLACK** | Slack | Channel, message template | Post message |
| **DISCORD** | Discord | Webhook URL, message | Send webhook |

### Data Flow

- Each node receives **context** (combined output from previous nodes)
- Node configuration and context are passed to its **executor**
- Executor returns updated context (merged with previous)
- **Topological sort** ensures nodes execute in dependency order

---

## Usage Guide

### Creating a Workflow

1. **Navigate to Dashboard:**
   - Log in or sign up via GitHub/Google/email
   - Click **"New Workflow"** in the sidebar

2. **Design Your Workflow:**
   - Add trigger node (e.g., Gmail trigger)
   - Add processing nodes (e.g., Gemini AI)
   - Add output nodes (e.g., Slack notification)
   - Connect nodes by dragging edges

3. **Configure Nodes:**
   - Click each node to open its config panel
   - For AI nodes: select model, adjust temperature
   - For messaging nodes: select credential and format message

4. **Add Credentials (if needed):**
   - Go to **Settings → Credentials**
   - Click **"Add Credential"**
   - Choose type (OpenAI, Anthropic, Gemini)
   - Paste API key (encrypted before storage)
   - Assign to nodes in the workflow

5. **Test & Deploy:**
   - Click **"Execute"** to run the workflow
   - Monitor execution in the **Executions** tab
   - View logs, output, and any errors

### Webhook Integration

**Trigger a workflow via external webhook:**

```bash
# Gmail trigger example
POST /api/webhooks/gmail?workflowId=<workflow-id>
Content-Type: application/json

{
  "id": "msg_123",
  "threadId": "thread_456",
  "subject": "Hello",
  "from": "sender@example.com",
  "fromEmail": "sender@example.com",
  "to": ["you@example.com"],
  "snippet": "This is an email",
  "plainBody": "Full email body here"
}
```

**Google Forms webhook:**
```bash
POST /api/webhooks/google-form?workflowId=<workflow-id>
Content-Type: application/json

{
  "formId": "form_123",
  "formTitle": "My Form",
  "responseId": "response_456",
  "respondentEmail": "respondent@example.com",
  "responses": { "question_1": "answer_1" }
}
```

**Google Sheets webhook:**
```bash
POST /api/webhooks/google-sheet?workflowId=<workflow-id>
Content-Type: application/json

{
  "spreadsheetId": "sheet_123",
  "spreadsheetName": "My Sheet",
  "sheetName": "Sheet1",
  "rowNumber": 2,
  "headers": ["Name", "Email"],
  "row": ["John", "john@example.com"]
}
```

**For local testing, use ngrok:**
```bash
npm run ngrok:dev
# Your URL: https://your-subdomain.ngrok.io/api/webhooks/gmail?workflowId=...
```

### Credential Management

1. **Create Credential:**
   ```bash
   # Via Dashboard: Settings → Credentials → Add Credential
   # Or via tRPC: credentials.create()
   ```

2. **Use in Workflow:**
   - Select credential type (OpenAI, Anthropic, Gemini)
   - Paste API key (automatically encrypted)
   - Assign to nodes that need it

3. **Security:**
   - Credentials are encrypted at-rest using `lib/encryption.ts`
   - Only decrypted at execution time
   - Scoped to user account (no cross-tenant leakage)

---

## API Documentation

### tRPC Routers

All endpoints are type-safe and require authentication.

#### Workflows Router
```typescript
// Get all workflows for current user
workflows.getMany({ page: 1, pageSize: 20, search?: string })

// Get workflow with nodes and edges
workflows.getOne({ id: string })

// Create new workflow (premium-only)
workflows.create()

// Update workflow structure (nodes + edges)
workflows.update({
  id: string,
  nodes: Array<{ id, type, position, data? }>,
  edges: Array<{ source, target, sourceHandle?, targetHandle? }>
})

// Update workflow name
workflows.updateName({ id: string, name: string })

// Delete workflow
workflows.remove({ id: string })

// Execute workflow
workflows.execute({ id: string })
```

#### Credentials Router
```typescript
// Get all credentials
credentials.getMany({ page: 1, pageSize: 20, search?: string })

// Get credential by ID
credentials.getOne({ id: string })

// Get by type (OPENAI | ANTHROPIC | GEMINI)
credentials.getByType({ type: CredentialType })

// Create credential (premium-only)
credentials.create({ name: string, type: CredentialType, value: string })

// Update credential
credentials.update({ id: string, name: string, type: CredentialType, value: string })

// Delete credential
credentials.remove({ id: string })
```

#### Executions Router
```typescript
// Get execution history
executions.getMany({ page: 1, pageSize: 20 })

// Get execution details
executions.getOne({ id: string })
```

---

## Deployment

### Environment Variables for Production

```env
# Critical for production
NODE_ENV=production
DATABASE_URL="postgresql://prod-user:strong-password@prod-db-host:5432/nexflow"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
BETTER_AUTH_URL="https://yourdomain.com"

# Enable Inngest in production
INNGEST_EVENT_KEY="evt_prod_..."
INNGEST_SIGNING_KEY="sig_prod_..."

# Rate limiting, CORS, etc.
ALLOWED_ORIGINS="https://yourdomain.com"
```

### Deployment Platforms

**Vercel (recommended for Next.js):**
```bash
vercel deploy
```

**Docker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Other (Railway, Render, etc.):**
- Set `NODE_ENV=production`
- Run migrations: `npx prisma migrate deploy`
- Start: `npm start`

---

## Troubleshooting

### OAuth Redirect Errors
- Ensure callback URLs match exactly in OAuth app settings
- Check `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` match your domain

### Workflow Execution Fails
- Check Inngest dashboard for error details
- Verify credentials are decrypted properly
- Ensure API keys are valid and have sufficient permissions

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running: `psql -c "SELECT 1"`
- Run migrations: `npx prisma migrate dev`

### Webhook Not Triggering
- Verify workflowId in URL is correct
- Use ngrok for local testing: `npm run ngrok:dev`
- Check Inngest logs for queued events

### Credential Encryption/Decryption
- Ensure `ENCRYPTION_KEY` is set consistently across environments
- For production, use a secrets manager (e.g., AWS Secrets Manager)

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repo** and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** and test locally:
   ```bash
   npm run lint
   npm run format
   ```

3. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add support for new node type"
   ```

4. **Push and open a Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Coding Standards

- Use TypeScript strictly (no `any`)
- Follow Biome linting rules
- Write unit tests for complex logic
- Document public APIs with JSDoc

---

## License

MIT © 2025 NexFlow Contributors

---

## Support & Community

- **Issues:** [GitHub Issues](https://github.com/yourusername/nexflow/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/nexflow/discussions)
- **Email:** support@nexflow.example.com

---

**Happy automating! 🚀**

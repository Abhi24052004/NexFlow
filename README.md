# NexFlow

NexFlow is a Next.js 15 app using the App Router, Prisma, tRPC, and Better Auth. It includes a reusable UI system (Radix + Tailwind) and an auth flow under `src/features/auth`.

## Features

- App Router pages with colocated API routes
- tRPC server/client integration with TanStack Query
- Better Auth with Prisma adapter (email + password)
- Prisma schema for users, sessions, accounts, and verification tokens
- Radix-based UI kit under `src/components/ui`

## Tech Stack

- Next.js 15, React 19, TypeScript
- Prisma (PostgreSQL)
- tRPC + TanStack Query
- Better Auth
- Tailwind CSS + Radix UI
- Biome for linting/formatting

## Project Structure

- `src/app` - App Router pages and route handlers
- `src/trpc` - tRPC setup (router, client, server helpers)
- `src/features/auth` - auth forms and UI
- `src/lib` - auth and database helpers
- `src/components/ui` - UI primitives
- `prisma` - schema and migrations

## Setup

1. Install dependencies:
	```bash
	npm install
	```

2. Copy the example environment file and fill in your values:
	```bash
	copy .env.example .env
	```

3. Create an `.env` file with your database connection string and OAuth credentials:
	```bash
	DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
	NEXT_PUBLIC_APP_URL="http://localhost:3000"
	BETTER_AUTH_URL="http://localhost:3000"
	GITHUB_CLIENT_ID="..."
	GITHUB_CLIENT_SECRET="..."
	GOOGLE_CLIENT_ID="..."
	GOOGLE_CLIENT_SECRET="..."
	POLAR_SUCCESS_URL="http://localhost:3000/"
	```

4. Register OAuth apps in GitHub and Google, then add these redirect URLs:
	```text
	http://localhost:3000/api/auth/callback/github
	http://localhost:3000/api/auth/callback/google
	```

5. Apply migrations and generate the Prisma client:
	```bash
	npx prisma migrate dev
	```

6. Start the dev server:
	```bash
	npm run dev
	```

Open http://localhost:3000 to view the app.

The login and signup pages already include GitHub and Google buttons, so once the OAuth apps and environment variables are configured, social signup works from either screen.

## Scripts

- `npm run dev` - start the dev server (Turbopack)
- `npm run build` - build for production (Turbopack)
- `npm run start` - start the production server
- `npm run lint` - run Biome checks
- `npm run format` - format with Biome

## Notes

- Prisma client output is generated under `src/generated/prisma`.
- Update the database provider or connection details in `prisma/schema.prisma` as needed.

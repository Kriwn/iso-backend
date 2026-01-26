# Elysia with Bun runtime

Backend API built with **Elysia** running on **Bun**, using **Prisma** as ORM.

## Prerequisites
Bun
PostgreSQL

## Environment Setup
Create an `.env` file from the example:
```bash
cp .env.example .env
```

## Getting Started
To get started with this template, simply paste this command into your terminal:

Generate Prisma client:

```bash
bunx prisma generate
```
Run database migrations (if applicable):
```
bunx prisma migrate dev
```
Seed mock data for testing:
```bash
bun run seed
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

Swagger API documentation is available at:
http://localhost:3000/docs

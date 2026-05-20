![License](https://img.shields.io/badge/License-MIT-green?style=flat)

# Todo API

Backend for a todo app running on Cloudflare Workers.

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat&logo=cloudflare&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?style=flat&logo=hono&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-000000?style=flat&logoColor=white)
![D1](https://img.shields.io/badge/Cloudflare-D1-F38020?style=flat&logo=cloudflare&logoColor=white)

## Live API + Docs

- Root API: https://todo.shivamkarn.workers.dev
- API Docs (OpenAPI + Scalar): https://todo.shivamkarn.workers.dev/docs

## Stack

- **Hono** — routing and middleware
- **Better Auth** — session-based authentication with Google OAuth
- **Cloudflare D1** — SQLite database at the edge
- **Cloudflare KV** — rate limiting
- **Drizzle ORM** — type-safe queries and schema management

## What it does

- Create, update, and soft-delete todos
- Filter todos by completion status and search by title
- Pagination on all list endpoints
- Google OAuth via Better Auth
- Rate limiting per IP using Cloudflare KV
- OpenAPI docs via Scalar

## Architecture

```
Request
  └── Hono Router
        ├── /api/auth/**   → Better Auth → Google OAuth → D1
        └── /api/todo/**   → Auth Middleware → Todo Handler → D1
```

## Docs

All endpoints are documented at:

- https://todo.shivamkarn.workers.dev/docs

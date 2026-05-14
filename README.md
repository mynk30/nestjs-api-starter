# 2nest-fastify

A production-ready, clone-and-go NestJS + Fastify boilerplate for rapid client project delivery. Supports **informative sites**, **e-commerce platforms**, and **admin panels** — all from a single API server.

Clone → update `client.config.ts` + `.env` → build client-specific features. No re-scaffolding ever again.

---

## Table of contents

- [What this boilerplate gives you](#what-this-boilerplate-gives-you)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Architecture decisions](#architecture-decisions)
- [API reference](#api-reference)
- [Environment variables](#environment-variables)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Module pattern](#module-pattern)
- [Client config — the one file you change per project](#client-config)
- [Clone checklist for a new client](#clone-checklist)

---

## What this boilerplate gives you

| Capability | Detail |
|---|---|
| Authentication | JWT access tokens + refresh token rotation, bcrypt password hashing |
| Authorisation | Role-based access control — `customer` and `admin` roles out of the box |
| Base CRUD | Generic `BaseRepository` with `findAll`, `findById`, `create`, `update`, `delete`, `count` — extend per module, never rewrite |
| Database | Mongoose + MongoDB with a clean module and schema-per-feature pattern |
| Validation | Zod validation pipe on every request body — structured `400` errors listing every invalid field |
| Security | `@fastify/helmet` (security headers), `@nestjs/throttler` (rate limiting), CORS per-client |
| Logging | Pino + `pino-pretty` in development, structured JSON in production. Global `LoggingInterceptor` already wired |
| Error handling | Global exception filter — every error returns the same JSON shape with request ID |
| Response shape | Global `TransformInterceptor` wraps every success response in a consistent envelope |
| Config | `@nestjs/config` + Zod schema validation — app refuses to start if any required env var is missing |
| Admin panel APIs | Full CRUD on all resources under `/admin/*`, guarded by JWT + admin role |
| Media upload | Pluggable media service for cloud storage (Cloudinary / S3) |
| Health check | `GET /health` for Docker, uptime monitors, and load balancers |
| Testing | Jest + Supertest, in-memory MongoDB via `mongodb-memory-server` for e2e tests |
| Docker | Multi-stage `Dockerfile` for production, `Dockerfile.dev` with hot reload, `docker-compose.yml` for local dev |
| CI/CD | GitHub Actions workflow — lint → test → build on every push and PR |

---

## Tech stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | NestJS v11 + TypeScript | Opinionated module structure, dependency injection, scales cleanly |
| HTTP engine | Fastify v5 | Significantly faster than Express, production-proven |
| Database | MongoDB + Mongoose | Flexible documents — suits both structured and semi-structured client data |
| Auth | JWT + Passport.js + bcrypt | Stateless tokens, works with any frontend |
| Validation | Zod | Schema-first, used for both request DTOs and env config |
| Logging | Pino + pino-pretty | Fastest Node.js logger, structured JSON output in production |
| Rate limiting | @nestjs/throttler | Protects all routes from abuse, configurable per-route |
| Security | @fastify/helmet | Sets HTTP security headers in one line |
| Testing | Jest + Supertest + mongodb-memory-server | Unit + e2e without a real database |
| Containers | Docker + Docker Compose | Consistent environments from laptop to production |
| CI/CD | GitHub Actions | Automated lint, test, build pipeline |
| Package manager | pnpm | Faster installs, strict dependency resolution |

---

## Project structure

```
2nest-fastify/
│
├── src/
│   ├── main.ts                         # Bootstrap — Fastify, Pino, global middleware
│   ├── app.module.ts                   # Root module — imports everything
│   ├── app.controller.ts               # GET / — welcome route
│   ├── app.service.ts                  # Root service
│   │
│   ├── config/
│   │   ├── app.config.ts               # PORT, NODE_ENV (Zod validated)
│   │   ├── database.config.ts          # MONGO_URI (Zod validated)
│   │   ├── jwt.config.ts               # JWT secrets and expiry (Zod validated)
│   │   └── client.config.ts            # ← THE ONE FILE YOU CHANGE PER CLIENT
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts     # @CurrentUser() param decorator
│   │   │   └── roles.decorator.ts            # @Roles('admin') route decorator
│   │   ├── filters/
│   │   │   └── global-exception.filter.ts    # Catches all errors, consistent JSON shape
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts             # Validates JWT on protected routes
│   │   │   └── roles.guard.ts                # Enforces role after JWT guard
│   │   ├── interceptors/
│   │   │   ├── logging/
│   │   │   │   ├── logging.interceptor.ts        # Logs method, URL, status, duration
│   │   │   │   └── logging.interceptor.spec.ts   # Unit tests
│   │   │   └── transform.interceptor.ts      # Wraps responses in { success, data, meta }
│   │   ├── middleware/
│   │   │   └── request-id.middleware.ts      # Attaches UUID to every request
│   │   ├── pipes/
│   │   │   └── zod-validation.pipe.ts        # Validates request bodies with Zod
│   │   └── types/
│   │       ├── api-response.type.ts          # Success + error envelope types
│   │       ├── pagination.type.ts            # Paginated request + response types
│   │       └── jwt-payload.type.ts           # Decoded JWT payload shape
│   │
│   ├── database/
│   │   ├── database.module.ts              # Global Mongoose connection module
│   │   └── base.repository.ts             # Generic CRUD — extend per feature
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts             # /auth/register, /login, /refresh, /logout
│   │   ├── auth.service.ts                # Token logic, password hashing, refresh rotation
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts            # Validates access token
│   │   │   └── jwt-refresh.strategy.ts    # Validates refresh token
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── refresh-token.dto.ts
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts            # /users/me — own profile only
│   │   ├── users.service.ts
│   │   ├── users.repository.ts            # Extends BaseRepository<User>
│   │   ├── schemas/
│   │   │   └── user.schema.ts             # User Mongoose schema
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── admin/
│   │   ├── admin.module.ts
│   │   ├── admin.controller.ts            # /admin/* — JWT + admin role required
│   │   ├── admin.service.ts
│   │   └── dto/
│   │       └── admin-update-user.dto.ts
│   │
│   ├── pages/                             # Informative site — CMS pages
│   │   ├── pages.module.ts
│   │   ├── pages.controller.ts            # GET /pages, GET /pages/:slug (public)
│   │   ├── pages.service.ts
│   │   ├── pages.repository.ts
│   │   ├── schemas/
│   │   │   └── page.schema.ts
│   │   └── dto/
│   │       ├── create-page.dto.ts
│   │       └── update-page.dto.ts
│   │
│   ├── posts/                             # Blog / content marketing
│   │   ├── posts.module.ts
│   │   ├── posts.controller.ts            # GET /posts, GET /posts/:slug (public)
│   │   ├── posts.service.ts
│   │   ├── posts.repository.ts
│   │   ├── schemas/
│   │   │   └── post.schema.ts
│   │   └── dto/
│   │       ├── create-post.dto.ts
│   │       └── update-post.dto.ts
│   │
│   ├── products/                          # E-commerce — product catalogue
│   │   ├── products.module.ts
│   │   ├── products.controller.ts         # GET /products, GET /products/:id (public)
│   │   ├── products.service.ts
│   │   ├── products.repository.ts
│   │   ├── schemas/
│   │   │   └── product.schema.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       └── update-product.dto.ts
│   │
│   ├── orders/                            # E-commerce — customer orders
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts           # POST /orders, GET /orders (JWT required)
│   │   ├── orders.service.ts
│   │   ├── orders.repository.ts
│   │   ├── schemas/
│   │   │   └── order.schema.ts
│   │   └── dto/
│   │       ├── create-order.dto.ts
│   │       └── update-order.dto.ts
│   │
│   ├── media/                             # File upload (Cloudinary / S3)
│   │   ├── media.module.ts
│   │   ├── media.controller.ts            # POST /media/upload (admin only)
│   │   └── media.service.ts
│   │
│   └── health/
│       ├── health.module.ts
│       └── health.controller.ts           # GET /health (public, no auth)
│
├── test/
│   ├── app.e2e-spec.ts                    # Root route e2e test (existing)
│   ├── jest-e2e.json                      # Jest e2e config (existing)
│   ├── setup.ts                           # In-memory MongoDB, global test config
│   └── auth/
│       └── auth.e2e-spec.ts               # Full auth flow e2e test
│
├── docker/
│   ├── Dockerfile                         # Multi-stage production build
│   └── Dockerfile.dev                     # Dev image with hot reload
│
├── .github/
│   └── workflows/
│       └── ci.yml                         # Lint → Test → Build pipeline
│
├── documentation/
│   ├── structure.md                       # Original scaffold overview
│   └── FOLDER_STRUCTURE.md               # Full folder explanation (detailed)
│
├── docker-compose.yml                     # Local: API + MongoDB + Redis
├── docker-compose.prod.yml                # Production overrides
├── .env.example                           # Template — copy to .env
├── .env                                   # Secrets — never committed
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

---

## Architecture decisions

### Consistent response shape

Every API response — success or error — returns the same JSON envelope. No guesswork on the frontend.

**Success:**
```json
{
  "success": true,
  "data": { },
  "meta": {
    "timestamp": "2026-05-09T10:00:00Z",
    "requestId": "a1b2c3d4-..."
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email must be a valid email",
    "statusCode": 400
  },
  "meta": {
    "timestamp": "2026-05-09T10:00:00Z",
    "requestId": "a1b2c3d4-..."
  }
}
```

### One backend, three API namespaces

The same NestJS server handles all three project types. Routes are separated by namespace and role — not by separate servers.

```
/auth/*          Public — no auth required
/pages/*         Public — informative site content
/posts/*         Public — blog content
/products/*      Public — product catalogue
/orders/*        Protected — customer JWT required
/users/me        Protected — customer JWT required
/media/*         Protected — admin role required
/admin/*         Protected — admin role required
/health          Public — uptime check
```

### Admin is not a separate server

The admin frontend hits `/admin/products`, `/admin/orders`, `/admin/users`. The customer app hits `/products`, `/orders`, `/users/me`. Same MongoDB collections, same Mongoose models, different guards. One server to deploy and maintain per client.

### Env validation at startup

`app.config.ts`, `database.config.ts`, and `jwt.config.ts` each parse and validate their environment variables using Zod when the app boots. If a variable is missing or the wrong type, the app throws immediately with the exact variable name. No silent runtime failures from a missing `.env` key.

### Generic base repository

```typescript
// Every repository extends this — never write CRUD again
class BaseRepository<T> {
  findAll(filter?, pagination?)   // paginated list
  findById(id)                    // by MongoDB _id
  findOne(filter)                 // by any field
  create(data)                    // insert document
  updateById(id, data)            // partial update
  deleteById(id)                  // remove document
  exists(filter)                  // boolean check
  count(filter)                   // count documents
}
```

---

## API reference

### Auth — public

```
POST  /auth/register      Register a new user account
POST  /auth/login         Login — returns access token + refresh token
POST  /auth/refresh       Exchange refresh token for new access token
POST  /auth/logout        Revoke refresh token
```

### Customer — JWT required

```
GET    /users/me           Get own profile
PATCH  /users/me           Update own profile
DELETE /users/me           Delete own account

POST   /orders             Place a new order
GET    /orders             Get own order history
GET    /orders/:id         Get a single order
```

### Public content

```
GET   /pages               List published pages
GET   /pages/:slug         Get page by slug

GET   /posts               List published posts (paginated)
GET   /posts/:slug         Get post by slug
GET   /posts/category/:cat Posts filtered by category

GET   /products            List products (paginated, filterable)
GET   /products/:id        Get product detail
GET   /products/search     Full-text search (?q=)
```

### Admin — JWT + admin role required

```
GET    /admin/users              List all users (paginated)
GET    /admin/users/:id          Get user by ID
PATCH  /admin/users/:id          Update user (role, status)
DELETE /admin/users/:id          Delete user

GET    /admin/products           List all products including drafts
POST   /admin/products           Create product
PATCH  /admin/products/:id       Update product
DELETE /admin/products/:id       Delete product

GET    /admin/orders             List all orders (paginated, filterable)
PATCH  /admin/orders/:id         Update order status

GET    /admin/posts              List all posts including drafts
POST   /admin/posts              Create post
PATCH  /admin/posts/:id          Update post
DELETE /admin/posts/:id          Delete post

GET    /admin/pages              List all pages
POST   /admin/pages              Create page
PATCH  /admin/pages/:id          Update page
DELETE /admin/pages/:id          Delete page

POST   /media/upload             Upload file — returns public URL
DELETE /media/:id                Delete uploaded file
```

### System

```
GET   /health              Returns { status: 'ok', timestamp }
```

---

## Environment variables

Copy `.env.example` to `.env` before running anything.

```bash
# Application
NODE_ENV=development
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/boilerplate

# JWT — use long random strings in production
JWT_ACCESS_SECRET=change_me_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change_me_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Redis (used by throttler rate limiting store)
REDIS_URL=redis://localhost:6379

# Media upload — fill in your provider credentials
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Getting started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Docker + Docker Compose

### Local development

```bash
# 1. Clone and install dependencies
git clone https://github.com/your-org/2nest-fastify.git my-project
cd my-project
pnpm install

# 2. Set up environment variables
cp .env.example .env
# Open .env and fill in your values

# 3. Start MongoDB and Redis via Docker
docker-compose up -d mongodb redis

# 4. Start the API with hot reload
pnpm run start:dev
```

API available at `http://localhost:3000`
Health check at `http://localhost:3000/health`

### Full stack via Docker (API + MongoDB + Redis together)

```bash
docker-compose up
```

---

## Scripts

```bash
# Development
pnpm run start:dev        # Hot reload dev server
pnpm run start:debug      # Dev server with Node debugger

# Production
pnpm run build            # Compile TypeScript → /dist
pnpm run start:prod       # Run compiled production build

# Testing
pnpm run test             # Unit tests
pnpm run test:watch       # Unit tests in watch mode
pnpm run test:e2e         # End-to-end tests
pnpm run test:cov         # Unit tests with coverage report

# Code quality
pnpm run lint             # ESLint check
pnpm run lint:fix         # ESLint auto-fix
pnpm run format           # Prettier format all files
```

---

## Module pattern

Every feature follows the same structure. When adding a new module for a client (e.g. `reviews`, `categories`, `coupons`):

```bash
# Generate the NestJS scaffold
nest g module features/reviews
nest g controller features/reviews
nest g service features/reviews
```

Then create the remaining files:

```
src/features/reviews/
├── reviews.module.ts          # Wire controller + service + repository
├── reviews.controller.ts      # HTTP routes only — delegates to service
├── reviews.service.ts         # Business logic only — delegates to repository
├── reviews.repository.ts      # DB queries only — extends BaseRepository<Review>
├── schemas/
│   └── review.schema.ts       # Mongoose schema + TypeScript type
└── dto/
    ├── create-review.dto.ts   # Zod schema for POST body
    └── update-review.dto.ts   # Zod schema for PATCH body (all fields optional)
```

**The strict layer rule — never skip a layer:**

```
Controller  →  receives request, calls service, returns response (no DB access)
Service     →  business logic, calls repository (no HTTP concerns)
Repository  →  database queries only, extends BaseRepository (no business logic)
```

---

## Client config

`src/config/client.config.ts` is the **only file you change when cloning for a new client.**

```typescript
export const clientConfig = {
  name: 'Client Name',

  features: {
    ecommerce: true,       // enables /products and /orders routes
    blog: true,            // enables /posts routes
    pages: true,           // enables /pages routes
    mediaUpload: true,     // enables /media routes
    adminPanel: true,      // enables /admin routes
  },

  cors: {
    origins: ['https://client.com', 'https://admin.client.com'],
  },

  rateLimit: {
    ttl: 60,               // window in seconds
    limit: 100,            // max requests per window
  },
};
```

Modules disabled via feature flags are not registered in `app.module.ts` — those routes simply do not exist in that deployment.

---

## Clone checklist

Use this every time you start a new client project.

- [ ] Clone repo — `git clone ... my-client-project`
- [ ] Install — `pnpm install`
- [ ] Copy env — `cp .env.example .env` and fill in real values
- [ ] Update `client.config.ts` — name, feature flags, CORS origins
- [ ] Disable unused modules in `app.module.ts` based on feature flags
- [ ] Add client-specific Mongoose schemas for new domain models
- [ ] Add client-specific modules using the module pattern
- [ ] Run `docker-compose up -d` and verify `GET /health` returns `{ status: 'ok' }`
- [ ] Create a new GitHub repo for the client and push
- [ ] Configure environment variables on the deployment platform

---

## Current build status

| Layer | Status |
|---|---|
| NestJS + Fastify scaffold | ✅ Done |
| Pino logging + LoggingInterceptor | ✅ Done |
| ConfigModule wired | ✅ Done |
| `config/` — Zod env validation | ✅ Done |
| `database/` — Mongoose module + BaseRepository | ✅ Done |
| `common/` — guards, filters, pipes, interceptors | ✅ Done |
| `auth/` — JWT + refresh tokens | ✅ Done |
| `customers/` — customer profile routes | ✅ Done |
| `admins/` — admin CRUD routes | ✅ Done |
| `pages/` — CMS pages | 🔲 Pending |
| `posts/` — blog content | 🔲 Pending |
| `products/` — product catalogue | 🔲 Pending |
| `orders/` — order management | 🔲 Pending |
| `media/` — file upload | 🔲 Pending |
| `health/` — health check | ✅ Done |
| Docker + Compose | ✅ Done |
| GitHub Actions CI | 🔲 Pending |

---

## License

MIT
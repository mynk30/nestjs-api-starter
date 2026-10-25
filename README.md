# 2nest-fastify

A production-ready, high-performance **NestJS (v11) + Fastify (v5)** boilerplate configured with **MongoDB (Mongoose)**, dual-collection authentication (**Customer** & **Admin**), generic repository patterns, and standardized response envelopes.

Designed as a clone-and-go foundation for modern web applications, e-commerce APIs, and SaaS backends.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Design Decisions](#architecture--design-decisions)
  - [Multi-Collection Domain Architecture](#multi-collection-domain-architecture)
  - [Hybrid Authentication & Token Storage Strategy](#hybrid-authentication--token-storage-strategy)
  - [Standardized Response & Error Envelopes](#standardized-response--error-envelopes)
  - [Generic Base Repository Pattern](#generic-base-repository-pattern)
- [API Reference](#api-reference)
  - [System Health](#system-health)
  - [Authentication](#authentication)
  - [Customer Routes](#customer-routes)
  - [Admin Routes](#admin-routes)
- [Environment Configuration](#environment-configuration)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Developer Tooling & Postman](#developer-tooling--postman)
- [Adding New Feature Modules](#adding-new-feature-modules)
- [License](#license)

---

## Features

| Capability | Detail |
|---|---|
| **High Performance Engine** | Fastify v5 HTTP adapter via `@nestjs/platform-fastify` with built-in Pino logging |
| **Multi-Collection Architecture** | Dedicated MongoDB collections and schemas for `customers` and `admins` |
| **Hybrid Authentication** | Short-lived JWT Access Tokens (Memory/Header) + Secure `HttpOnly` Refresh Token Cookies |
| **Server-Side Session Control** | Refresh tokens saved in MongoDB for instant invalidation and token revocation on logout |
| **Role-Based Guards** | `JwtAuthGuard` (Bearer extraction) and `AdminGuard` (checks `req.user.type === 'admin'`) |
| **Generic Repository Layer** | `BaseRepository<T>` providing pre-built CRUD (`create`, `findAll`, `findOne`, `findById`, `updateById`, `deleteById`, `count`, `exists`) |
| **Strict Request Validation** | Global `ValidationPipe` with `class-validator` and `class-transformer` (auto-strip & whitelist) |
| **Standardized Responses** | `TransformInterceptor` wraps all successful responses in `{ success: true, data, meta: { timestamp } }` |
| **Centralized Error Handling** | `GlobalExceptionFilter` guarantees unified error envelopes `{ success: false, error: { code, message, statusCode }, meta }` |
| **Request Performance Logging** | Fastify hook + `LoggingInterceptor` logging method, path, status, and duration (ms) |
| **Dynamic Configuration** | `@nestjs/config` loading environment-specific configs (`.env.development`, `.env.production`) |
| **Postman API Collection** | Included `postman_collection.json` with pre-written test scripts for automatic token and cookie handling |
| **Process Management** | Ready-to-use PM2 configuration (`ecosystem.dev.config.js`) with file watching and log rotation |

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | NestJS | `^11.0.1` | Modular structure, dependency injection, and decorators |
| **HTTP Engine** | Fastify | `^5.8.5` | High-throughput, low-overhead HTTP layer |
| **Fastify Adapter** | `@nestjs/platform-fastify` | `^11.1.19` | NestJS integration with Fastify |
| **Cookies** | `@fastify/cookie` | `^11.0.2` | Fastify plugin for HttpOnly cookie parsing and setting |
| **Database** | MongoDB + Mongoose | `^9.6.1` | Document storage with schemas and timestamps |
| **Database Integration** | `@nestjs/mongoose` | `^11.0.4` | NestJS Mongoose module |
| **Authentication** | Passport.js + `@nestjs/jwt` | `^11.0.2` | JWT generation, verification, and passport strategy |
| **Password Security** | bcrypt | `^6.0.0` | Secure password hashing with salt generation |
| **Validation** | class-validator + class-transformer | `^0.15.1` | Declarative DTO validation pipes |
| **Logging** | Pino + pino-pretty | `^13.1.3` | High-performance JSON logger and terminal formatting |
| **Configuration** | `@nestjs/config` | `^4.0.4` | Environment variable loader per environment |
| **Package Manager** | npm | - | Standard package and dependency management |

---

## Project Structure

```text
2nest-fastify/
├── documentation/                  # Architecture and API documentation
│   ├── index.html                  # Interactive visual API documentation
│   ├── technical-structure.html    # Visual technical architecture breakdown
│   └── structure.md                # Complete file and architecture reference
├── src/
│   ├── main.ts                     # Entry point: Fastify adapter, cookies, filters, interceptors
│   ├── app.module.ts               # Root module importing feature & core modules
│   ├── app.controller.ts           # Root welcome route (GET /)
│   ├── app.service.ts              # Root service
│   │
│   ├── config/
│   │   └── client.config.ts        # Client CORS configuration
│   │
│   ├── common/                     # Cross-cutting concerns & shared infrastructure
│   │   ├── filters/
│   │   │   └── global-exception.filter.ts    # Standardizes all error responses
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts             # Validates Bearer access tokens
│   │   │   └── admin.guard.ts                # Restricts route to user.type === 'admin'
│   │   └── interceptors/
│   │       ├── logging/
│   │       │   ├── logging.interceptor.ts    # Logs request duration and status
│   │       │   └── logging.interceptor.spec.ts
│   │       └── transform.interceptor.ts      # Wraps success payloads into standard envelope
│   │
│   ├── database/                   # Database layer
│   │   ├── database.module.ts      # Global Mongoose connection module
│   │   └── base.repository.ts      # Generic repository with complete CRUD operations
│   │
│   ├── auth/                       # Authentication feature module
│   │   ├── auth.module.ts          # Configures JwtModule and Passport
│   │   ├── auth.controller.ts      # /auth/customer/*, /auth/admin/*, /auth/refresh, /auth/logout
│   │   ├── auth.service.ts         # Dual auth logic, token issuance, cookie handling
│   │   ├── dto/
│   │   │   └── auth.dto.ts         # RegisterDto, LoginDto (class-validator)
│   │   ├── interface/
│   │   │   └── jwt.interface.ts    # JwtPayload interface ({ id, email, type })
│   │   └── strategies/
│   │       └── jwt.strategy.ts     # Passport JWT Bearer extraction strategy
│   │
│   ├── customers/                  # Customer feature module
│   │   ├── customers.module.ts     # Customer schemas, controllers, and services
│   │   ├── customers.controller.ts # Customer self-service: /customers/me, change-password
│   │   ├── admin-customer.controller.ts # Admin customer management: /admin/customers/*
│   │   ├── customers.service.ts    # Customer business logic and password hashing
│   │   ├── customers.repository.ts # Extends BaseRepository<CustomerDocument>
│   │   ├── schemas/
│   │   │   └── customer.schema.ts  # Customer Mongoose schema (customers collection)
│   │   └── dto/
│   │       ├── create-customer.dto.ts
│   │       └── update-customer.dto.ts
│   │
│   ├── admins/                     # Admin feature module
│   │   ├── admins.module.ts        # Admin schema, controller, repository, service
│   │   ├── admins.controller.ts    # Protected admin profile: /admins/me
│   │   ├── admins.service.ts       # Admin queries and creation logic
│   │   ├── admins.repository.ts    # Extends BaseRepository<AdminDocument>
│   │   └── schemas/
│   │       └── admin.schema.ts     # Admin Mongoose schema (admins collection)
│   │
│   └── health/                     # System health check module
│       ├── health.module.ts
│       ├── health.controller.ts    # GET /health
│       └── health.service.ts       # System uptime, environment, and timestamp calculation
│
├── test/                           # End-to-end and integration tests
│   ├── app.e2e-spec.ts             # Application E2E test
│   └── jest-e2e.json               # E2E test configuration
│
├── .env.development               # Development environment variables
├── .env.production                # Production environment template
├── ecosystem.dev.config.js         # PM2 development runner configuration
├── postman_collection.json         # Complete Postman collection with test assertions
├── package.json                    # Project dependencies and npm scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

---

## Architecture & Design Decisions

### Multi-Collection Domain Architecture

Rather than overloading a single `users` collection with complex role discriminator columns, this boilerplate separates identities into two distinct collections:
- **`customers` Collection**: Stores customer credentials, contact details (`phone`, `countryCode`, `alternatePhone`), status flags (`isActive`), profile avatars, and refresh tokens.
- **`admins` Collection**: Stores administrative staff credentials and refresh tokens.

Both models integrate seamlessly with authentication: JWT payloads carry an account `type` (`'customer' | 'admin'`).

### Hybrid Authentication & Token Storage Strategy

To safeguard against both **Cross-Site Scripting (XSS)** and **Cross-Site Request Forgery (CSRF)**:

1. **Access Token (Short-Lived, 15 Minutes)**:
   - Returned directly in the response payload body `{ accessToken, user }`.
   - The frontend stores this in **memory** (e.g., in React/Vue state or memory store) and sends it as a `Bearer <token>` in the `Authorization` header.
2. **Refresh Token (Long-Lived, 7 Days)**:
   - Stored in a secure **`HttpOnly` Cookie** (`customer_refresh_token` or `admin_refresh_token`).
   - Browser scripts cannot access this cookie, defending against XSS credential exfiltration.
   - Also persisted in MongoDB on the corresponding user record.
3. **Session Invalidation & Logout**:
   - `POST /auth/refresh` reads the cookie, verifies token signature, and validates that it matches the token in the database.
   - `POST /auth/logout` sets the database `refreshToken` to `null` and clears the cookie via `@fastify/cookie`.

### Standardized Response & Error Envelopes

Every API route returns a predictable JSON structure for frontends to consume:

#### Success Response (via `TransformInterceptor`):
```json
{
  "success": true,
  "data": {
    "id": "6714a5ef8c13...",
    "email": "customer@example.com",
    "name": "Jane Doe"
  },
  "meta": {
    "timestamp": "2026-10-20T13:30:00.000Z"
  }
}
```

#### Error Response (via `GlobalExceptionFilter`):
```json
{
  "success": false,
  "error": {
    "code": "BadRequestException",
    "message": "Password must be at least 6 characters long",
    "statusCode": 400
  },
  "meta": {
    "timestamp": "2026-10-20T13:30:00.000Z",
    "path": "/auth/customer/register"
  }
}
```

### Generic Base Repository Pattern

All domain repositories extend `BaseRepository<T extends Document>` from `src/database/base.repository.ts`, eliminating boilerplate database code:

```typescript
export abstract class BaseRepository<T extends Document> {
  create(data: any): Promise<T>
  findAll(filter?: QueryFilter<T>, options?: QueryOptions): Promise<T[]>
  findOne(filter: QueryFilter<T>, options?: QueryOptions): Promise<T | null>
  findById(id: string, options?: QueryOptions): Promise<T | null>
  updateById(id: string, data: UpdateQuery<T>, options?: QueryOptions): Promise<T | null>
  deleteById(id: string, options?: QueryOptions): Promise<T | null>
  count(filter?: QueryFilter<T>): Promise<number>
  exists(filter: QueryFilter<T>): Promise<boolean>
}
```

---

## API Reference

### System Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Returns uptime, human-readable uptime, timestamp, and environment |
| `GET` | `/` | None | Welcome greeting |

### Authentication

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/auth/customer/register` | `{ name, email, password }` | Registers a customer account |
| `POST` | `/auth/customer/login` | `{ email, password }` | Authenticates customer, returns `accessToken` & sets `customer_refresh_token` cookie |
| `POST` | `/auth/admin/register` | `{ name, email, password }` | Registers an admin account |
| `POST` | `/auth/admin/login` | `{ email, password }` | Authenticates admin, returns `accessToken` & sets `admin_refresh_token` cookie |
| `POST` | `/auth/refresh` | None (reads cookie) | Issues new `accessToken` from valid refresh cookie |
| `POST` | `/auth/logout` | None (reads cookie) | Clears refresh token in database and expires the HttpOnly cookie |

### Customer Routes

| Method | Endpoint | Auth Guard | Description |
|---|---|---|---|
| `GET` | `/customers/me` | `JwtAuthGuard` | Fetch current customer profile |
| `PATCH` | `/customers/me` | `JwtAuthGuard` | Update current customer profile |
| `DELETE` | `/customers/me` | `JwtAuthGuard` | Deactivate own customer account |
| `PATCH` | `/customers/change-password` | `JwtAuthGuard` | Change password (`{ oldPassword, newPassword }`) |
| `POST` | `/customers` | `JwtAuthGuard` + `AdminGuard` | Admin-created customer profile |

### Admin Routes

| Method | Endpoint | Auth Guard | Description |
|---|---|---|---|
| `GET` | `/admins/me` | `JwtAuthGuard` + `AdminGuard` | Fetch current admin profile |
| `GET` | `/admin/customers` | `JwtAuthGuard` + `AdminGuard` | List all customer accounts |
| `GET` | `/admin/customers/:id` | `JwtAuthGuard` + `AdminGuard` | Retrieve customer details by ID |
| `PATCH` | `/admin/customers/:id` | `JwtAuthGuard` + `AdminGuard` | Update customer details / status by ID |
| `DELETE` | `/admin/customers/:id` | `JwtAuthGuard` + `AdminGuard` | Remove customer account by ID |

---

## Environment Configuration

Configuration is loaded dynamically per `NODE_ENV` (e.g. `.env.development` or `.env.production`).

### Environment Variables

```env
# Application Port and Mode
PORT=3010
NODE_ENV=development

# MongoDB Connection Options
MONGODB_URI=mongodb://localhost:27017/
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_DATABASE=ecommerce

# JWT Secrets (use high-entropy secrets in production)
JWT_ACCESS_SECRET=your-access-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
```

> **Note on MongoDB Connection:** If `MONGODB_URI` is provided, `DatabaseModule` connects via URI. Otherwise, it constructs the URI from `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`.

---

## Getting Started

### Prerequisites

- **Node.js** (v20+ recommended)
- **npm** (v10+)
- **MongoDB** instance running locally or hosted (e.g. MongoDB Atlas)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/mynk30/nestjs-api-starter.git my-api
cd my-api
npm install
```

### 2. Configure Environment

Review and update `.env.development`:

```bash
# Ensure MongoDB host, port, database name, and JWT secrets match your environment
cat .env.development
```

### 3. Start the Server

```bash
# Development mode with hot-reload
npm run start:dev

# Or run using PM2 config
npm run build
pm2 start ecosystem.dev.config.js
```

The application will start on port `3010` (or `PORT` specified in `.env.development`):
- Health check: `http://localhost:3010/health`
- Welcome route: `http://localhost:3010/`

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run start` | Start the application with Nest CLI |
| `npm run start:dev` | Start the application in watch mode (hot reload) |
| `npm run start:debug` | Start with debugging enabled |
| `npm run build` | Compile TypeScript into `/dist` bundle |
| `npm run start:prod` | Execute compiled production code (`node dist/main`) |
| `npm test` | Run Jest unit tests |
| `npm run test:watch` | Run Jest unit tests in watch mode |
| `npm run test:cov` | Generate test coverage report |
| `npm run test:e2e` | Run end-to-end tests via Supertest |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format` | Format source code with Prettier |

---

## Developer Tooling & Postman

The project includes a ready-to-import **Postman Collection** at `postman_collection.json`.

### Postman Setup:
1. Open Postman -> **Import** -> Select `postman_collection.json`.
2. Define the collection or environment variable:
   - `base_url`: `http://localhost:3010`
3. Execute authentication requests:
   - `Customer Login`: Tests automatically store `accessToken` into `{{customer_token}}` and receive the `customer_refresh_token` HttpOnly cookie.
   - `Admin Login`: Tests automatically store `accessToken` into `{{admin_token}}` and receive the `admin_refresh_token` HttpOnly cookie.
   - `Refresh Token`: Automatically exchanges the cookie for a new access token.
   - `Logout`: Clears server-side and browser cookies.

### Visual Documentation
Open `documentation/index.html` or `documentation/technical-structure.html` directly in any web browser to view the interactive documentation dashboard and architecture breakdown.

---

## Adding New Feature Modules

To create a new domain module (e.g. `products`), adhere to the standard three-layer architecture:

### 1. Scaffold Feature Folder
```text
src/products/
├── schemas/
│   └── product.schema.ts      # Mongoose Schema & Document
├── dto/
│   ├── create-product.dto.ts  # Validation DTO (class-validator)
│   └── update-product.dto.ts
├── products.repository.ts     # Extends BaseRepository<ProductDocument>
├── products.service.ts        # Business logic calling repository
├── products.controller.ts     # HTTP controllers with guards
└── products.module.ts         # Registers model, repository, controller, service
```

### 2. Implement the Repository
```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database/base.repository';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }
}
```

### 3. Register in `app.module.ts`
Import `ProductsModule` into `AppModule`'s `imports` array.

---

## License

This project is licensed under the [UNLICENSED](LICENSE) license.
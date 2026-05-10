# Project Structure Overview

This document provides a comprehensive overview of the `2nest-fastify` project structure and its components.

## Project Overview

`2nest-fastify` is a boilerplate project for building scalable and efficient server-side applications using [NestJS](https://nestjs.com/) and [Fastify](https://www.fastify.io/). It is configured with TypeScript and follows a modular architecture.

## Directory Structure

```text
2nest-fastify/
├── documentation/          # Project documentation
│   ├── structure.md        # Project structure overview (this file)
│   ├── index.html          # API landing page
│   └── technical-structure.html # Technical architecture overview
├── src/                    # Source code
│   ├── common/             # Shared utilities, interceptors, filters, etc.
│   │   ├── filters/        # Global exception filters
│   │   ├── guards/         # Security guards (JwtAuthGuard, AdminGuard)
│   │   └── interceptors/   # NestJS Interceptors
│   ├── config/             # Application configuration files
│   ├── database/           # Database connection and base logic
│   ├── customers/          # Customers feature module
│   │   ├── schemas/        # Customer schema (customers collection)
│   │   ├── customers.module.ts
│   │   ├── customers.repository.ts
│   │   ├── customers.controller.ts
│   │   └── customers.service.ts
│   ├── admins/             # Admins feature module
│   │   ├── schemas/        # Admin schema (admins collection)
│   │   ├── admins.module.ts
│   │   ├── admins.repository.ts
│   │   ├── admins.controller.ts
│   │   └── admins.service.ts
│   ├── auth/               # Authentication module
│   │   ├── dto/            # RegisterDto, LoginDto
│   │   ├── strategies/     # JwtStrategy (validates 'type' field)
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts # /auth/customer/* and /auth/admin/*
│   │   └── auth.service.ts # Dual registration/login flows
│   ├── main.ts             # Application entry point
│   ├── app.module.ts       # Root module
│   ├── app.controller.ts   # Main controller
│   └── app.service.ts      # Main service
├── test/                   # End-to-end (E2E) tests
├── package.json            # Project dependencies
└── README.md               # Project landing page
```

## Detailed File Descriptions

### `src/` Directory

- **`main.ts`**: The entry point. It bootstraps the NestJS application using `FastifyAdapter`. Configured with:
    - **Pino Logging**: High-performance logging.
    - **CORS**: Configured via `client.config.ts`.
    - **Global Interceptors**: `LoggingInterceptor` and `TransformInterceptor`.
    - **Global Filters**: `GlobalExceptionFilter` for uniform error handling.
- **`app.module.ts`**: The root module. Imports `ConfigModule`, `DatabaseModule`, `CustomersModule`, `AdminsModule`, and `AuthModule`.

### `src/customers/`
- **`schemas/customer.schema.ts`**: Defines the `Customer` entity and its `customers` collection.
- **`customers.repository.ts`**: Extends `BaseRepository` for customer data access.
- **`customers.controller.ts`**: Contains `/customers/me` for authenticated profile retrieval.

### `src/admins/`
- **`schemas/admin.schema.ts`**: Defines the `Admin` entity and its `admins` collection.
- **`admins.repository.ts`**: Extends `BaseRepository` for admin data access.
- **`admins.controller.ts`**: Contains admin-protected routes, including `/admins/me`.

### `src/auth/`
- **`auth.service.ts`**: Business logic for registration and login. Supports separate flows for customers and admins.
- **`auth.controller.ts`**: Authentication endpoints separated by account type (`/auth/customer/*` and `/auth/admin/*`).
- **`strategies/jwt.strategy.ts`**: Validates tokens and returns the account `type` (customer/admin) in the user object.

### `src/common/`
- **`guards/jwt-auth.guard.ts`**: Ensures the request has a valid JWT token.
- **`guards/admin.guard.ts`**: Ensures the authenticated user has the `type: 'admin'` attribute.

## Technology Stack

- **Framework**: NestJS (v11)
- **HTTP Engine**: Fastify (v5)
- **Database**: MongoDB via Mongoose (Multi-collection approach)
- **Security**: Passport JWT & bcrypt
- **Account Types**: Customer & Admin
- **Logging**: Pino & `pino-pretty`
- **Testing**: Jest
- **Environment Management**: `@nestjs/config`

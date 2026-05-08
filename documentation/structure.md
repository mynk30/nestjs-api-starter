# Project Structure Overview

This document provides a comprehensive overview of the `2nest-fastify` project structure and its components.

## Project Overview

`2nest-fastify` is a boilerplate project for building scalable and efficient server-side applications using [NestJS](https://nestjs.com/) and [Fastify](https://www.fastify.io/). It is configured with TypeScript and follows a modular architecture.

## Directory Structure

```text
2nest-fastify/
├── documentation/          # Project documentation
│   └── structure.md        # Project structure overview (this file)
├── src/                    # Source code
│   ├── common/             # Shared utilities, interceptors, filters, etc.
│   │   └── interceptors/   # NestJS Interceptors
│   │       └── logging/    # Request/Response logging logic
│   ├── config/             # Application configuration files
│   │   └── client.config.ts # Client-side config (CORS, feature flags)
│   ├── database/           # Database connection and base logic
│   │   ├── database.module.ts # Global Mongoose connection module
│   │   └── base.repository.ts # Generic CRUD base class
│   ├── users/              # Users feature module
│   │   ├── schemas/        # Mongoose schemas
│   │   │   └── user.schema.ts
│   │   ├── users.module.ts
│   │   ├── users.repository.ts # Specialized user data access
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── main.ts             # Application entry point
│   ├── app.module.ts       # Root module
│   ├── app.controller.ts   # Main controller
│   ├── app.service.ts      # Main service
│   └── app.controller.spec.ts # Unit tests for AppController
├── test/                   # End-to-end (E2E) tests
├── .gitignore              # Files and folders ignored by Git
├── .prettierrc             # Prettier formatting rules
├── eslint.config.mjs       # ESLint linting configuration
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Project dependencies and npm scripts
├── pnpm-lock.yaml          # pnpm lockfile
├── tsconfig.json           # Main TypeScript configuration
└── README.md               # Project landing page and high-level docs
```

## Detailed File Descriptions

### `src/` Directory

- **`main.ts`**: The entry point. It bootstraps the NestJS application using `FastifyAdapter`. Configured with:
    - **Pino Logging**: High-performance logging.
    - **CORS**: Configured via `client.config.ts`.
    - **Global Interceptors**: `LoggingInterceptor` for request tracking.
- **`app.module.ts`**: The root module. Imports `ConfigModule`, `DatabaseModule`, and feature modules like `UsersModule`.

### `src/config/`
- **`client.config.ts`**: Centralized configuration for client-specific settings. This is the primary file for project-level customization.

### `src/database/`
- **`database.module.ts`**: A global module establishing the Mongoose connection.
- **`base.repository.ts`**: A generic base class providing common database operations (`create`, `find`, `update`, `delete`, etc.) to all feature repositories.

### `src/users/`
- **`schemas/user.schema.ts`**: Defines the `User` entity and its Mongoose schema (name, email, password, timestamps).
- **`users.repository.ts`**: Extends `BaseRepository`. Handles all database interactions for users.
- **`users.module.ts`**: Wires up the schema, repository, service, and controller.

### `src/common/`
- **`interceptors/logging/logging.interceptor.ts`**: Logs HTTP method, URL, status code, and response time.

## Technology Stack

- **Framework**: NestJS (v11)
- **HTTP Engine**: Fastify (v5)
- **Database**: MongoDB via Mongoose
- **Language**: TypeScript
- **Logging**: Pino & `pino-pretty`
- **Environment Management**: `@nestjs/config`
- **Testing**: Jest
- **Linting & Formatting**: ESLint & Prettier

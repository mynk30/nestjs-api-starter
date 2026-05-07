# Project Structure Overview

This document provides a comprehensive overview of the `2nest-fastify` project structure and its components.

## Project Overview

`2nest-fastify` is a boilerplate project for building scalable and efficient server-side applications using [NestJS](https://nestjs.com/) and [Fastify](https://www.fastify.io/). It is configured with TypeScript and follows the modular architecture recommended by NestJS.

## Directory Structure

```text
2nest-fastify/
├── documentation/          # Project documentation
│   └── structure.md        # Project structure overview (this file)
├── src/                    # Source code
│   ├── common/             # Shared utilities, interceptors, filters, etc.
│   │   └── interceptors/   # NestJS Interceptors
│   │       └── logging/    # Request/Response logging logic
│   │           ├── logging.interceptor.ts
│   │           └── logging.interceptor.spec.ts
│   ├── main.ts             # Application entry point
│   ├── app.module.ts       # Root module
│   ├── app.controller.ts   # Main controller
│   ├── app.service.ts      # Main service
│   └── app.controller.spec.ts # Unit tests for AppController
├── test/                   # End-to-end (E2E) tests
│   ├── app.e2e-spec.ts     # E2E tests for root routes
│   └── jest-e2e.json       # Jest configuration for E2E tests
├── .gitignore              # Files and folders ignored by Git
├── .prettierrc             # Prettier formatting rules
├── eslint.config.mjs       # ESLint linting configuration
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Project dependencies and npm scripts
├── pnpm-lock.yaml          # pnpm lockfile for deterministic installs
├── tsconfig.build.json     # TypeScript config for production builds
├── tsconfig.json           # Main TypeScript configuration
└── README.md               # Basic project information
```

## Detailed File Descriptions

### Root Directory

- **`nest-cli.json`**: Configures the NestJS CLI, specifying the source root (`src`) and compiler options.
- **`package.json`**: Defines project dependencies (NestJS, Fastify, RxJS, Mongoose, etc.) and scripts for building, running, and testing the application.
- **`tsconfig.json`**: The primary TypeScript configuration file. It uses `nodenext` for module resolution and targets `ES2023`.

### `src/` Directory

The `src` directory contains the core logic of the application.

- **`main.ts`**: The entry point. It bootstraps the NestJS application using `FastifyAdapter`. It is configured with:
    - **Pino Logging**: Uses `pino-pretty` in development for readable logs and standard JSON logs in production.
    - **Global Interceptors**: Implements a global `LoggingInterceptor` for tracking request/response cycles.
- **`app.module.ts`**: The root module. It imports `ConfigModule` for environment management.
- **`app.controller.ts`**: Handles incoming HTTP requests. Current endpoint: `GET /`.
- **`app.service.ts`**: Contains business logic. Currently returns a "Hello World" message.

### `src/common/` Directory

Contains shared resources used across the application.

- **`interceptors/logging/logging.interceptor.ts`**: A NestJS interceptor that logs the HTTP method, URL, status code, and response time for every incoming request.

### `test/` Directory

- **`app.e2e-spec.ts`**: End-to-end tests verifying the application stack.
- **`jest-e2e.json`**: Jest configuration for E2E testing.

## Technology Stack

- **Framework**: NestJS (v11)
- **HTTP Engine**: Fastify (v5)
- **Database (Optional)**: Mongoose / MongoDB (Support included)
- **Language**: TypeScript
- **Logging**: Pino & `pino-pretty`
- **Environment Management**: `@nestjs/config`
- **Testing**: Jest
- **Linting & Formatting**: ESLint & Prettier

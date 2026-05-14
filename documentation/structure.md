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
│   │       ├── logging/    # Logging Interceptor
│   │       │   └── logging.interceptor.ts
│   │       └── transform.interceptor.ts
│   ├── config/             # Application configuration files
│   ├── database/           # Database connection and base logic
│   │   ├── base.repository.ts # Generic repository base class
│   │   └── database.module.ts # Mongoose connection module
│   ├── customers/          # Customers feature module
│   │   ├── schemas/        # Customer schema (customers collection)
│   │   ├── dto/            # CreateCustomerDto, UpdateCustomerDto
│   │   ├── customers.module.ts
│   │   ├── customers.repository.ts
│   │   ├── customers.controller.ts # Customer-facing routes (/customers/*)
│   │   ├── admin-customer.controller.ts # Admin-facing routes (/admin/customers/*)
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
│   ├── health/             # Health check module
│   │   ├── health.module.ts
│   │   ├── health.controller.ts
│   │   └── health.service.ts
│   ├── main.ts             # Application entry point
│   ├── app.module.ts       # Root module
│   ├── app.controller.ts   # Main controller
│   └── app.service.ts      # Main service
├── test/                   # End-to-end (E2E) tests
├── ecosystem.dev.config.js # PM2 development configuration
├── postman_collection.json # Postman API collection
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
- **`app.module.ts`**: The root module. Imports `ConfigModule`, `DatabaseModule`, `CustomersModule`, `AdminsModule`, `AuthModule`, and `HealthModule`.

### `src/customers/`
- **`schemas/customer.schema.ts`**: Defines the `Customer` entity and its `customers` collection.
- **`dto/`**: Contains `CreateCustomerDto` for creation and `UpdateCustomerDto` for profile/admin updates.
- **`customers.repository.ts`**: Extends `BaseRepository` for customer data access.
- **`customers.controller.ts`**: Handles customer-owned actions: `/customers/me` (Get/Update profile, Delete account) and `/customers/change-password`.
- **`admin-customer.controller.ts`**: Handles admin management of customers: `/admin/customers` (Get all, Get by ID, Update, Delete).
- **`customers.service.ts`**: Centralized logic for customer management, including password hashing and data filtering.

### `src/admins/`
- **`schemas/admin.schema.ts`**: Defines the `Admin` entity and its `admins` collection.
- **`admins.repository.ts`**: Extends `BaseRepository` for admin data access.
- **`admins.controller.ts`**: Contains admin-protected routes, including `/admins/me`.

### `src/auth/`
- **`auth.service.ts`**: Business logic for registration and login. Supports separate flows for customers and admins.
- **`auth.controller.ts`**: Authentication endpoints separated by account type (`/auth/customer/*` and `/auth/admin/*`).
- **`strategies/jwt.strategy.ts`**: Validates tokens and returns the account `type` (customer/admin) in the user object.

### `src/health/`
- **`health.controller.ts`**: Provides a `/health` endpoint for monitoring application status.
- **`health.service.ts`**: Contains logic for checking database connectivity and overall system health.

### `src/common/`
- **`guards/jwt-auth.guard.ts`**: Ensures the request has a valid JWT token.
- **`guards/admin.guard.ts`**: Ensures the authenticated user has the `type: 'admin'` attribute.
- **`filters/global-exception.filter.ts`**: Catches all unhandled exceptions and returns a standardized JSON response.

### Root Files
- **`ecosystem.dev.config.js`**: PM2 configuration for development, managing environment variables and application restarts.
- **`postman_collection.json`**: A pre-configured Postman collection for testing all API endpoints.

## Technology Stack

- **Framework**: NestJS (v11)
- **HTTP Engine**: Fastify (v5)
- **Database**: MongoDB via Mongoose (Multi-collection approach)
- **Security**: Passport JWT & bcrypt
- **Account Types**: Customer & Admin
- **Logging**: Pino & `pino-pretty`
- **Testing**: Jest
- **Environment Management**: `@nestjs/config`
## Configuration & Environment

The project uses `.env` files (e.g., `.env.development`) managed by `@nestjs/config`.

### Required Variables:
- `MONGODB_HOST`: MongoDB server address (e.g., `localhost`)
- `MONGODB_PORT`: MongoDB port (e.g., `27017`)
- `MONGODB_DATABASE`: Database name
- `JWT_ACCESS_SECRET`: Secret key for short-lived access tokens
- `JWT_REFRESH_SECRET`: Secret key for long-lived refresh tokens
- `PORT`: Application port (e.g., `3010`)
- `NODE_ENV`: Environment name (`development` or `production`)

## Authentication Storage Strategy

The project uses a hybrid token storage strategy for maximum security:

- **Access Token**: Returned in the JSON response body. It should be stored in **Frontend Memory** (e.g., a simple variable or state) to prevent theft via XSS.
- **Refresh Token**: Stored in a **Secure, HttpOnly Cookie**. This prevents any client-side JavaScript from accessing the token.
- **Separate Cookies**:
  - `customer_refresh_token`: For customer sessions.
  - `admin_refresh_token`: For admin sessions.
- **DB Validation**: Every refresh request is validated against the database, allowing for session control and revocation.

## API Documentation

- **Static Docs**: Accessible at `/documentation/index.html`




## Authentication Flow (Updated)

The project implements a robust JWT-based authentication flow with session control:

- **Access Token**: Short-lived (15 minutes) token used for authorizing API requests.
- **Refresh Token**: Long-lived (7 days) token stored in the database. It is used to obtain new access tokens without requiring the user to re-login.
- **Refresh Endpoint**: `POST /auth/refresh` automatically reads the refresh token from the browser's cookies.
- **Logout Endpoint**: `POST /auth/logout` removes the refresh token from the database and clears the HttpOnly cookie.

- **DB Validation**: Every refresh request is validated against the database, allowing for immediate session revocation (logout).

> **Note**: Logging out removes the refresh token from the database, preventing any further access token generation for that session. Existing access tokens will remain valid until they expire naturally.


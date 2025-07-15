# Playgram API

This is the backend service for the Playgram application. It is built with Node.js, TypeScript, Express, and Prisma ORM.

## Features

-   RESTful API for Playgram
-   Type-safe codebase with TypeScript
-   Database management with Prisma
-   Modular Express server

## Technologies

-   Node.js
-   TypeScript
-   Express
-   Prisma

## Getting Started

1. **Clone the repository**

    ```bash
    git clone https://github.com/igorfrag/playgram-api
    cd playgram-api
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    - Copy `.env.example` to `.env` and update values as needed.

4. **Run database migrations**

    ```bash
    npx prisma migrate dev
    ```

5. **Start the server**
    ```bash
    npm run dev
    ```

## Scripts

-   `npm run dev` — Start development server
-   `npm run build` — Build for production
-   `npm run start` — Start production server

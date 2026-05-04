# API Studenti — Design Spec

**Date:** 2026-05-04  
**Purpose:** Educational REST CRUD APIs for junior frontend developers. No authentication. Local setup with a single command.

---

## Tech Stack

- Node.js + Express + TypeScript
- SQLite via `better-sqlite3` (synchronous, zero config)
- `uuid` for server-side id generation
- `zod` for input validation
- `swagger-ui-express` + `swagger-jsdoc` for interactive documentation
- `ts-node-dev` for hot reload in development

---

## Project Structure

```
api-studenti/
├── src/
│   ├── controllers/
│   │   └── student.controller.ts
│   ├── routes/
│   │   └── student.routes.ts
│   ├── db/
│   │   └── database.ts
│   ├── types/
│   │   └── student.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── .env
```

---

## Data Model

```typescript
interface IStudent {
  id: string;       // UUID v4, generated server-side
  name: string;
  lastname: string;
  email: string;
  age: number;
}
```

---

## Endpoints

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/student` | — | `200` array of students |
| GET | `/student/:id` | — | `200` student / `404` |
| POST | `/student` | `{ name, lastname, email, age }` | `201` created student |
| PUT | `/student/:id` | `{ name, lastname, email, age }` | `200` updated student / `404` |
| DELETE | `/student/:id` | — | `204` no content / `404` |

---

## Validation (zod)

Applied on POST and PUT:

- `name`: non-empty string, required
- `lastname`: non-empty string, required
- `email`: valid email format, required
- `age`: integer > 0, required

Validation error → `400 Bad Request` with body `{ "error": "<message>" }`

---

## Standard errors

```json
{ "error": "Student not found" }
{ "error": "Invalid email format" }
{ "error": "age must be a positive number" }
{ "error": "Validation failed: name is required" }
```

---

## Seed Data

8 students seeded on first run (only if table is empty). Enables immediate GET testing without creating data.

---

## CORS

Enabled for all origins (`*`). Juniors can call the APIs from any local frontend.

---

## Swagger

Available at `http://localhost:3000/api-docs`. Generated from JSDoc in route files. Allows testing all endpoints from the browser without external tools.

---

## Scripts

```
npm run dev    # ts-node-dev with hot reload
npm run build  # compile TypeScript to /dist
npm start      # start compiled build
```

---

## Setup

1. `npm install`
2. `npm run dev`
3. API: `http://localhost:3000`
4. Docs: `http://localhost:3000/api-docs`

The `students.db` file is created automatically on first run.

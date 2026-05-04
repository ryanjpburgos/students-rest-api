# API Studenti Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-config local REST CRUD API for students using Node.js, Express, TypeScript, SQLite, and Swagger — usable by junior frontend devs with a single `npm run dev`.

**Architecture:** Routes+Controller pattern. `student.routes.ts` defines endpoints and Swagger JSDoc. `student.controller.ts` contains all CRUD logic and Zod validation. `db/database.ts` initializes SQLite and seeds 8 students on first run.

**Tech Stack:** Express 4, TypeScript 5, better-sqlite3, uuid, zod, swagger-jsdoc, swagger-ui-express, ts-node-dev, cors.

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | deps, scripts |
| `tsconfig.json` | TS compiler config |
| `.env` | PORT=3000 |
| `src/types/student.ts` | IStudent interface |
| `src/db/database.ts` | SQLite init + seed |
| `src/controllers/student.controller.ts` | CRUD logic + Zod validation |
| `src/routes/student.routes.ts` | Express routes + Swagger JSDoc |
| `src/index.ts` | App entry: Express, CORS, Swagger, mount routes |
| `README.md` | Setup instructions |

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.env`
- Create: `src/` directory structure

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p src/controllers src/routes src/db src/types
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "api-studenti",
  "version": "1.0.0",
  "description": "Educational REST APIs for practicing HTTP requests",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "better-sqlite3": "^9.4.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "uuid": "^9.0.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.8",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.6",
    "@types/uuid": "^9.0.7",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Create `.env`**

```
PORT=3000
```

- [ ] **Step 5: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 6: Commit**

```bash
git init
git add package.json tsconfig.json .env
git commit -m "chore: project scaffolding"
```

---

## Task 2: Types

**Files:**
- Create: `src/types/student.ts`

- [ ] **Step 1: Create `src/types/student.ts`**

```typescript
export interface IStudent {
  id: string;
  name: string;
  lastname: string;
  email: string;
  age: number;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/student.ts
git commit -m "feat: add IStudent type"
```

---

## Task 3: Database Initialization and Seed

**Files:**
- Create: `src/db/database.ts`

- [ ] **Step 1: Create `src/db/database.ts`**

```typescript
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'students.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER NOT NULL
  )
`);

const { count } = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };

if (count === 0) {
  const insert = db.prepare(
    'INSERT INTO students (id, name, lastname, email, age) VALUES (?, ?, ?, ?, ?)'
  );

  const seed: [string, string, string, number][] = [
    ['Mario', 'Rossi', 'mario.rossi@email.com', 22],
    ['Giulia', 'Bianchi', 'giulia.bianchi@email.com', 20],
    ['Luca', 'Ferrari', 'luca.ferrari@email.com', 24],
    ['Sofia', 'Esposito', 'sofia.esposito@email.com', 21],
    ['Marco', 'Romano', 'marco.romano@email.com', 23],
    ['Anna', 'Colombo', 'anna.colombo@email.com', 19],
    ['Davide', 'Ricci', 'davide.ricci@email.com', 25],
    ['Chiara', 'Marino', 'chiara.marino@email.com', 20],
  ];

  seed.forEach(([name, lastname, email, age]) => {
    insert.run(uuidv4(), name, lastname, email, age);
  });
}

export default db;
```

- [ ] **Step 2: Commit**

```bash
git add src/db/database.ts
git commit -m "feat: add SQLite database init and seed data"
```

---

## Task 4: Student Controller

**Files:**
- Create: `src/controllers/student.controller.ts`

- [ ] **Step 1: Create `src/controllers/student.controller.ts`**

```typescript
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import db from '../db/database';
import { IStudent } from '../types/student';

const studentSchema = z.object({
  name: z.string().min(1, 'name is required'),
  lastname: z.string().min(1, 'lastname is required'),
  email: z.string().email('Invalid email format'),
  age: z.number().int().positive('age must be a positive number'),
});

export const getAll = (_req: Request, res: Response): void => {
  const students = db.prepare('SELECT * FROM students').all() as IStudent[];
  res.json(students);
};

export const getById = (req: Request, res: Response): void => {
  const student = db
    .prepare('SELECT * FROM students WHERE id = ?')
    .get(req.params.id) as IStudent | undefined;

  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  res.json(student);
};

export const create = (req: Request, res: Response): void => {
  const result = studentSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }

  const { name, lastname, email, age } = result.data;
  const id = uuidv4();

  db.prepare(
    'INSERT INTO students (id, name, lastname, email, age) VALUES (?, ?, ?, ?, ?)'
  ).run(id, name, lastname, email, age);

  res.status(201).json({ id, name, lastname, email, age });
};

export const update = (req: Request, res: Response): void => {
  const existing = db
    .prepare('SELECT * FROM students WHERE id = ?')
    .get(req.params.id);

  if (!existing) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  const result = studentSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }

  const { name, lastname, email, age } = result.data;

  db.prepare(
    'UPDATE students SET name = ?, lastname = ?, email = ?, age = ? WHERE id = ?'
  ).run(name, lastname, email, age, req.params.id);

  res.json({ id: req.params.id, name, lastname, email, age });
};

export const remove = (req: Request, res: Response): void => {
  const existing = db
    .prepare('SELECT * FROM students WHERE id = ?')
    .get(req.params.id);

  if (!existing) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
  res.status(204).send();
};
```

- [ ] **Step 2: Commit**

```bash
git add src/controllers/student.controller.ts
git commit -m "feat: add student controller with CRUD and Zod validation"
```

---

## Task 5: Routes and Swagger JSDoc

**Files:**
- Create: `src/routes/student.routes.ts`

- [ ] **Step 1: Create `src/routes/student.routes.ts`**

```typescript
import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/student.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         name:
 *           type: string
 *           example: "Mario"
 *         lastname:
 *           type: string
 *           example: "Rossi"
 *         email:
 *           type: string
 *           format: email
 *           example: "mario.rossi@email.com"
 *         age:
 *           type: integer
 *           example: 22
 *     StudentInput:
 *       type: object
 *       required: [name, lastname, email, age]
 *       properties:
 *         name:
 *           type: string
 *           example: "Mario"
 *         lastname:
 *           type: string
 *           example: "Rossi"
 *         email:
 *           type: string
 *           format: email
 *           example: "mario.rossi@email.com"
 *         age:
 *           type: integer
 *           example: 22
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Student not found"
 */

/**
 * @swagger
 * /student:
 *   get:
 *     summary: Returns all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', getAll);

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Returns a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student UUID
 *     responses:
 *       200:
 *         description: Student found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getById);

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', create);

/**
 * @swagger
 * /student/{id}:
 *   put:
 *     summary: Update an existing student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', update);

/**
 * @swagger
 * /student/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student UUID
 *     responses:
 *       204:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', remove);

export default router;
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/student.routes.ts
git commit -m "feat: add student routes with Swagger JSDoc annotations"
```

---

## Task 6: App Entry Point

**Files:**
- Create: `src/index.ts`

- [ ] **Step 1: Create `src/index.ts`**

```typescript
import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import studentRouter from './routes/student.routes';
import './db/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Studenti',
      version: '1.0.0',
      description: 'Educational REST APIs for practicing HTTP requests',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./src/routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/student', studentRouter);

app.listen(PORT, () => {
  console.log(`\nServer: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs\n`);
});
```

- [ ] **Step 2: Commit**

```bash
git add src/index.ts
git commit -m "feat: add Express app entry point with CORS and Swagger"
```

---

## Task 7: Smoke Test and README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Start the server**

```bash
npm run dev
```

Expected output:
```
Server: http://localhost:3000
Swagger: http://localhost:3000/api-docs
```

- [ ] **Step 2: Verify GET /student returns 8 seed students**

```bash
curl http://localhost:3000/student
```

Expected: JSON array with 8 students.

- [ ] **Step 3: Verify POST /student creates a student**

```bash
curl -X POST http://localhost:3000/student \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","lastname":"User","email":"test@email.com","age":21}'
```

Expected: `201` with body `{ "id": "<uuid>", "name": "Test", ... }`.

- [ ] **Step 4: Verify GET /student/:id**

Take the `id` from Step 3:

```bash
curl http://localhost:3000/student/<id-from-step-3>
```

Expected: `200` with the student object.

- [ ] **Step 5: Verify PUT /student/:id**

```bash
curl -X PUT http://localhost:3000/student/<id-from-step-3> \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated","lastname":"User","email":"updated@email.com","age":25}'
```

Expected: `200` with updated student.

- [ ] **Step 6: Verify DELETE /student/:id**

```bash
curl -X DELETE http://localhost:3000/student/<id-from-step-3>
```

Expected: `204` no content.

- [ ] **Step 7: Verify validation error**

```bash
curl -X POST http://localhost:3000/student \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","lastname":"User","email":"not-an-email","age":21}'
```

Expected: `400` with `{ "error": "Invalid email format" }`.

- [ ] **Step 8: Verify 404**

```bash
curl http://localhost:3000/student/id-che-non-esiste
```

Expected: `404` with `{ "error": "Student not found" }`.

- [ ] **Step 9: Verify Swagger UI**

Open `http://localhost:3000/api-docs` in browser. Confirm all 5 endpoints appear and are testable.

- [ ] **Step 10: Create `README.md`**

```markdown
# API Studenti

Educational REST APIs for practicing HTTP requests.

## Setup

```bash
npm install
npm run dev
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/student` | List all students |
| GET | `/student/:id` | Returns a student |
| POST | `/student` | Create a student |
| PUT | `/student/:id` | Update a student |
| DELETE | `/student/:id` | Delete a student |

## Interactive documentation

Open `http://localhost:3000/api-docs` to test the APIs from your browser.

## POST/PUT body example

```json
{
  "name": "Mario",
  "lastname": "Rossi",
  "email": "mario.rossi@email.com",
  "age": 22
}
```
```

- [ ] **Step 11: Final commit**

```bash
git add README.md
git commit -m "docs: add README with setup instructions"
```

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
    res.status(400).json({ errors: result.error.errors.map(e => e.message) });
    return;
  }

  const { name, lastname, email, age } = result.data;
  const id = uuidv4();

  try {
    db.prepare(
      'INSERT INTO students (id, name, lastname, email, age) VALUES (?, ?, ?, ?, ?)'
    ).run(id, name, lastname, email, age);
  } catch (err: unknown) {
    if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }
    throw err;
  }

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
    res.status(400).json({ errors: result.error.errors.map(e => e.message) });
    return;
  }

  const { name, lastname, email, age } = result.data;

  try {
    db.prepare(
      'UPDATE students SET name = ?, lastname = ?, email = ?, age = ? WHERE id = ?'
    ).run(name, lastname, email, age, req.params.id);
  } catch (err: unknown) {
    if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }
    throw err;
  }

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

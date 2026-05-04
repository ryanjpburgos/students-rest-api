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

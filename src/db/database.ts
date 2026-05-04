import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'students.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER NOT NULL
  )
`);

const { count } = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };

if (count === 0) {
  type SeedRow = { name: string; lastname: string; email: string; age: number };

  const seed: SeedRow[] = [
    { name: 'Mario', lastname: 'Rossi', email: 'mario.rossi@email.com', age: 22 },
    { name: 'Giulia', lastname: 'Bianchi', email: 'giulia.bianchi@email.com', age: 20 },
    { name: 'Luca', lastname: 'Ferrari', email: 'luca.ferrari@email.com', age: 24 },
    { name: 'Sofia', lastname: 'Esposito', email: 'sofia.esposito@email.com', age: 21 },
    { name: 'Marco', lastname: 'Romano', email: 'marco.romano@email.com', age: 23 },
    { name: 'Anna', lastname: 'Colombo', email: 'anna.colombo@email.com', age: 19 },
    { name: 'Davide', lastname: 'Ricci', email: 'davide.ricci@email.com', age: 25 },
    { name: 'Chiara', lastname: 'Marino', email: 'chiara.marino@email.com', age: 20 },
  ];

  const seedDb = db.transaction((rows: SeedRow[]) => {
    const insert = db.prepare(
      'INSERT INTO students (id, name, lastname, email, age) VALUES (?, ?, ?, ?, ?)'
    );
    for (const row of rows) {
      insert.run(uuidv4(), row.name, row.lastname, row.email, row.age);
    }
  });

  seedDb(seed);
}

export default db;

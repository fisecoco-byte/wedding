import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'wedding.db');

const db = new Database(dbPath);

// Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    guests INTEGER DEFAULT 1,
    attendance BOOLEAN,
    needs_lodging BOOLEAN,
    note TEXT,
    created_at TEXT,
    date TEXT
  )
`);

// Migration: Add date column if not exists (for existing dbs)
try {
  db.exec('ALTER TABLE rsvps ADD COLUMN date TEXT');
} catch (e) {
  // Column likely already exists
}

export default db;

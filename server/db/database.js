import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'scores.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT    NOT NULL,
    mode        TEXT    NOT NULL,
    difficulty  TEXT    NOT NULL,
    moves       INTEGER,
    time_seconds INTEGER,
    winner      TEXT,
    created_at  TEXT    NOT NULL
  )
`);

export default db;

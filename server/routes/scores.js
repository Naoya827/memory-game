import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.post('/scores', (req, res) => {
  const { player_name, mode, difficulty, moves, time_seconds, winner } = req.body;

  if (!player_name || !mode || !difficulty) {
    return res.status(400).json({ error: 'player_name, mode, difficulty are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO scores (player_name, mode, difficulty, moves, time_seconds, winner, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    player_name,
    mode,
    difficulty,
    moves ?? null,
    time_seconds ?? null,
    winner ?? null,
    new Date().toISOString(),
  );

  res.status(201).json({ id: result.lastInsertRowid });
});

router.get('/scores/ranking', (req, res) => {
  const { difficulty, mode, limit = '10' } = req.query;

  let query = 'SELECT * FROM scores WHERE 1=1';
  const params = [];

  if (difficulty) {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }
  if (mode) {
    query += ' AND mode = ?';
    params.push(mode);
  }

  if (mode === 'solo') {
    query += ' ORDER BY moves ASC, time_seconds ASC';
  } else {
    query += ' ORDER BY created_at DESC';
  }

  query += ' LIMIT ?';
  params.push(parseInt(limit, 10));

  const rows = db.prepare(query).all(...params);
  res.json(rows);
});

export default router;

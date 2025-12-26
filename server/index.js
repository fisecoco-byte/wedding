import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Get all RSVPs
app.get('/api/rsvps', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM rsvps ORDER BY created_at DESC');
    const rsvps = stmt.all();
    res.json(rsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit RSVP
app.post('/api/rsvp', (req, res) => {
  const { name, phone, guests, attendance, needsLodging, note, created_at, date } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Check if exists
    const checkStmt = db.prepare('SELECT id FROM rsvps WHERE name = ?');
    const existing = checkStmt.get(name);

    if (existing) {
      const updateStmt = db.prepare(`
        UPDATE rsvps 
        SET phone = ?, guests = ?, attendance = ?, needs_lodging = ?, note = ?, created_at = ?
        WHERE id = ?
      `);
      updateStmt.run(phone, guests, attendance ? 1 : 0, needsLodging ? 1 : 0, note, created_at, existing.id);
    } else {
      const insertStmt = db.prepare(`
        INSERT INTO rsvps (name, phone, guests, attendance, needs_lodging, note, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      insertStmt.run(name, phone, guests, attendance ? 1 : 0, needsLodging ? 1 : 0, note, created_at);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving RSVP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

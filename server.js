// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// serve static files מתוך public/
app.use(express.static(path.join(__dirname, 'public')));

// תמיד נחזיר index.html ב־/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json());
app.use(cors());

// --- API routes ---

// תלמידים
app.get('/api/students', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
});
app.post('/api/students', async (req, res) => {
    const { name, age, activity } = req.body;
    const [result] = await pool.query(
        'INSERT INTO students (name, age, activity) VALUES (?, ?, ?)',
        [name, age, activity]
    );
    res.json({ id: result.insertId, name, age, activity });
});
app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, activity } = req.body;
    await pool.query(
        'UPDATE students SET name=?, age=?, activity=? WHERE id=?',
        [name, age, activity, id]
    );
    res.sendStatus(204);
});
app.delete('/api/students/:id', async (req, res) => {
    await pool.query('DELETE FROM students WHERE id=?', [req.params.id]);
    res.sendStatus(204);
});

// סדר יום
app.get('/api/schedule', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM schedule');
    res.json(rows);
});
app.post('/api/schedule', async (req, res) => {
    const { day, morning_activity, afternoon_activity } = req.body;
    const [result] = await pool.query(
        'INSERT INTO schedule (day, morning_activity, afternoon_activity) VALUES (?, ?, ?)',
        [day, morning_activity, afternoon_activity]
    );
    res.json({ id: result.insertId, day, morning_activity, afternoon_activity });
});
app.put('/api/schedule/:id', async (req, res) => {
    const { id } = req.params;
    const { day, morning_activity, afternoon_activity } = req.body;
    await pool.query(
        'UPDATE schedule SET day=?, morning_activity=?, afternoon_activity=? WHERE id=?',
        [day, morning_activity, afternoon_activity, id]
    );
    res.sendStatus(204);
});
app.delete('/api/schedule/:id', async (req, res) => {
    await pool.query('DELETE FROM schedule WHERE id=?', [req.params.id]);
    res.sendStatus(204);
});

// הפעלת השרת
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

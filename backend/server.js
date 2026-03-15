// server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ai-lms-mauve.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/roadmaps', require('./routes/roadmaps'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/jobs',     require('./routes/jobs'));

app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error.', error: err.message });
});

/* ─── boot ──────────────────────────────────────────────────── */
const { initDatabase } = require('./config/database');
const seed             = require('./config/seed');

initDatabase()
  .then(seed)
  .then(() => app.listen(PORT, () =>
    console.log(`🚀  AI-LMS running on http://localhost:${PORT}`)
  ))
  .catch((err) => { console.error('Boot failed:', err); process.exit(1); });

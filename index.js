// index.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

// --- Hardcoded demo user (for learning only) ---
const demoUser = {
  id: 'user123',
  username: 'demo',
  // In production store hashed passwords! This is plain text for simplicity.
  password: 'password123'
};

// --- Login route: issues JWT when credentials match ---
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  if (username !== demoUser.username || password !== demoUser.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = { sub: demoUser.id, username: demoUser.username };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

  res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
});

// --- Protected route: only accessible with valid JWT ---
app.get('/protected', auth, (req, res) => {
  // auth middleware adds req.user
  res.json({ message: 'You accessed a protected resource', user: req.user });
});

// Public route for comparison
app.get('/', (req, res) => res.send('Public endpoint — no token needed'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

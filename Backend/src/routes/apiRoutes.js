const express = require('express');
const router = express.Router();

// Mock database for users
const users = [];

router.get('/status', (req, res) => {
  res.json({ message: 'API is live', app: 'TransitOps' });
});

router.post('/signup', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(401).json({ message: 'Email, password, and role are required' });
  }
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(401).json({ message: 'User already exists' });
  }

  const newUser = { email, password, role };
  users.push(newUser);
  return res.status(200).json({ message: 'Registered successfully', user: { email: newUser.email, role: newUser.role } });
});

router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(401).json({ message: 'Email, password, and role are required' });
  }

  const user = users.find(u => u.email === email && u.password === password && u.role === role);
  
  if (user) {
    return res.status(200).json({ message: 'Login successful', user: { email: user.email, role: user.role } });
  } else {
    return res.status(401).json({ message: 'Invalid credentials or role' });
  }
});

module.exports = router;

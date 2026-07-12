const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { signupUser, createAdminUser, loginUser, authenticateJWT, authorizeRoles, listUsers, disableUser, resetUserPassword } = require('./auth');

const healthRoutes = require('./src/routes/healthRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'TransitOps backend is running' });
});

app.use(healthRoutes);
app.use('/api', apiRoutes);

app.post('/auth/signup', async (req, res) => {
  try {
    const result = await signupUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message });
  }
});

app.get('/auth/me', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

app.get('/admin/users', authenticateJWT, authorizeRoles('fleet_manager'), (req, res) => {
  res.json(listUsers(req.query.role || ''));
});

app.post('/admin/users', authenticateJWT, authorizeRoles('fleet_manager'), async (req, res) => {
  try {
    const result = await createAdminUser(req.body);
    res.status(201).json({ ...result.user, temporaryPassword: req.body.password });
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message });
  }
});

app.patch('/admin/users/:userId/disable', authenticateJWT, authorizeRoles('fleet_manager'), (req, res) => {
  try {
    disableUser(req.params.userId);
    res.json({ ok: true });
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message });
  }
});

app.post('/admin/users/:userId/reset-password', authenticateJWT, authorizeRoles('fleet_manager'), async (req, res) => {
  try {
    const user = await resetUserPassword(req.params.userId, req.body.temporaryPassword);
    res.json({ ok: true, user: { id: user.id, name: user.name, username: user.username } });
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message });
  }
});

app.get('/admin/dashboard', authenticateJWT, authorizeRoles('fleet_manager'), (req, res) => {
  res.json({ message: 'Admin dashboard access granted', user: req.user });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

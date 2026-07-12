const { signupUser, loginUser } = require('../models/userModel');

async function register(req, res) {
  try {
    const result = await signupUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message });
  }
}

function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, me };

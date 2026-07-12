const express = require('express');
const { register, login, me } = require('../controllers/authController');
const { authenticateJWT } = require('../models/userModel');

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.get('/me', authenticateJWT, me);

module.exports = router;

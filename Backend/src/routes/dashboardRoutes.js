const express = require('express');
const { authenticateJWT } = require('../models/userModel');
const { getDashboardSummary } = require('../services/dashboardService');

const router = express.Router();

router.get('/kpis', authenticateJWT, (req, res) => {
  res.json(getDashboardSummary().kpis);
});

router.get('/trips', authenticateJWT, (req, res) => {
  res.json(getDashboardSummary().trips);
});

router.get('/vehicle-status', authenticateJWT, (req, res) => {
  res.json(getDashboardSummary().vehicleStatus);
});

module.exports = router;

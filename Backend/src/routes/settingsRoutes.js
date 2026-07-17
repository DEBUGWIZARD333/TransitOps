const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/role-permissions', (req, res) => {
  res.json({
    admin: {
      dashboard: true,
      userManagement: true,
      fleet: true,
      drivers: true,
      trips: true,
      maintenance: true,
      fuelExpenses: true,
      analytics: true,
      reports: true,
      settings: true,
    },
    fleet_manager: {
      dashboard: true,
      fleet: true,
      drivers: true,
      trips: true,
      maintenance: true,
      fuelExpenses: true,
      analytics: true,
      settings: true,
    },
    dispatcher: {
      dashboard: true,
      trips: true,
      fleet: false,
      drivers: false,
    },
    safety_officer: {
      dashboard: true,
      drivers: true,
      safetyReports: true,
      licenseMonitoring: true,
    },
    financial_analyst: {
      dashboard: true,
      fuelExpenses: true,
      analytics: true,
      reports: true,
    },
  });
});

router.get('/', (req, res) => {
  res.json(db.settings);
});

router.put('/', (req, res) => {
  Object.assign(db.settings, req.body);
  res.json({ message: 'Settings updated successfully', settings: db.settings });
});

module.exports = router;

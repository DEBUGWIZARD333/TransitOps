const express = require('express');
const router = express.Router();

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
  res.json({
    companyName: 'TransitOps',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    currency: 'NGN',
  });
});

router.put('/', (req, res) => {
  res.json({ message: 'Settings updated successfully' });
});

module.exports = router;

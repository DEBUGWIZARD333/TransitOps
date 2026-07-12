const express = require('express');
const router = express.Router();

const drivers = [
  {
    id: 1,
    driverName: 'Amina Yusuf',
    licenseNumber: 'DL-1201',
    licenseCategory: 'Class A',
    licenseExpiryDate: '2026-12-15',
    contactNumber: '+2348080010001',
    tripCompletionPercentage: 92,
    safetyScore: 96,
    status: 'Available',
  },
  {
    id: 2,
    driverName: 'Bola Hassan',
    licenseNumber: 'DL-1202',
    licenseCategory: 'Class B',
    licenseExpiryDate: '2025-08-01',
    contactNumber: '+2348080010002',
    tripCompletionPercentage: 78,
    safetyScore: 88,
    status: 'On Trip',
  },
  {
    id: 3,
    driverName: 'Chidi Okafor',
    licenseNumber: 'DL-1203',
    licenseCategory: 'Class C',
    licenseExpiryDate: '2026-03-20',
    contactNumber: '+2348080010003',
    tripCompletionPercentage: 65,
    safetyScore: 74,
    status: 'Suspended',
  },
];

router.get('/', (req, res) => {
  const { search = '', status = '' } = req.query;
  const filtered = drivers.filter((driver) => {
    const matchesSearch = `${driver.driverName} ${driver.licenseNumber}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || driver.status === status;
    return matchesSearch && matchesStatus;
  });
  res.json(filtered);
});

router.post('/', (req, res) => {
  const { driverName, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, tripCompletionPercentage, safetyScore, status } = req.body;
  if (!driverName || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (drivers.some((driver) => driver.licenseNumber.toLowerCase() === licenseNumber.toLowerCase())) {
    return res.status(409).json({ error: 'License number must be unique' });
  }
  const newDriver = {
    id: drivers.length + 1,
    driverName,
    licenseNumber,
    licenseCategory,
    licenseExpiryDate,
    contactNumber,
    tripCompletionPercentage: Number(tripCompletionPercentage || 0),
    safetyScore: Number(safetyScore || 0),
    status,
  };
  drivers.push(newDriver);
  res.status(201).json(newDriver);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { drivers } = require('../models/db');

router.get('/', (req, res) => {
  const { search = '', status = '' } = req.query;
  const filtered = drivers.filter((driver) => {
    const matchesSearch = `${driver.driverName} ${driver.licenseNumber}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || driver.status === status;
    return matchesSearch && matchesStatus;
  });
  res.json(filtered);
});

const { signupUser } = require('../models/userModel');

router.post('/', async (req, res) => {
  const { driverName, email, password, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, tripCompletionPercentage, safetyScore, status } = req.body;
  if (!driverName || !email || !password || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (drivers.some((driver) => driver.licenseNumber.toLowerCase() === licenseNumber.toLowerCase())) {
    return res.status(409).json({ error: 'License number must be unique' });
  }

  try {
    // Create user credentials for the driver
    await signupUser({
      name: driverName,
      email: email,
      username: email,
      password: password,
      role: 'driver'
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({ error: error.message });
  }

  const newDriver = {
    id: drivers.length + 1,
    driverName,
    email,
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

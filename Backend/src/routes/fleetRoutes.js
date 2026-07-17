const express = require('express');
const router = express.Router();
const { vehicles } = require('../models/db');

router.get('/vehicles', (req, res) => {
  const { search = '', status = '', vehicleType = '' } = req.query;
  const filtered = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.registrationNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || vehicle.status === status;
    const matchesVehicleType = !vehicleType || vehicle.vehicleType === vehicleType;
    return matchesSearch && matchesStatus && matchesVehicleType;
  });
  res.json(filtered);
});

router.post('/vehicles', (req, res) => {
  const { registrationNumber, vehicleName, vehicleType, maxCapacity, odometer, acquisitionCost, status } = req.body;
  if (!registrationNumber || !vehicleName || !vehicleType || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (vehicles.some((vehicle) => vehicle.registrationNumber.toLowerCase() === registrationNumber.toLowerCase())) {
    return res.status(409).json({ error: 'Registration number must be unique' });
  }
  const newVehicle = {
    id: vehicles.length + 1,
    registrationNumber,
    vehicleName,
    vehicleType,
    maxCapacity: Number(maxCapacity || 0),
    odometer: Number(odometer || 0),
    acquisitionCost: Number(acquisitionCost || 0),
    status,
  };
  vehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

module.exports = router;

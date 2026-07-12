const express = require('express');
const router = express.Router();

const vehicles = [
  {
    id: 1,
    registrationNumber: 'TR-001',
    vehicleName: 'Metro Bus 01',
    vehicleType: 'Bus',
    maxCapacity: 48,
    odometer: 124500,
    acquisitionCost: 180000,
    status: 'Available',
  },
  {
    id: 2,
    registrationNumber: 'TR-002',
    vehicleName: 'City Shuttle 02',
    vehicleType: 'Van',
    maxCapacity: 12,
    odometer: 87420,
    acquisitionCost: 65000,
    status: 'On Trip',
  },
  {
    id: 3,
    registrationNumber: 'TR-003',
    vehicleName: 'Express Truck 03',
    vehicleType: 'Truck',
    maxCapacity: 24,
    odometer: 158200,
    acquisitionCost: 120000,
    status: 'In Shop',
  },
  {
    id: 4,
    registrationNumber: 'TR-004',
    vehicleName: 'Regional Coach 04',
    vehicleType: 'Bus',
    maxCapacity: 54,
    odometer: 221000,
    acquisitionCost: 240000,
    status: 'Retired',
  },
];

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

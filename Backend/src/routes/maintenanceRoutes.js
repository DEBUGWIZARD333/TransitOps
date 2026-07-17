const express = require('express');
const router = express.Router();
const { maintenanceRecords } = require('../models/db');

router.get('/', (req, res) => {
  const { search = '', status = '' } = req.query;
  const filtered = maintenanceRecords.filter((record) => {
    const matchesSearch = `${record.vehicleId} ${record.serviceType}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || record.maintenanceStatus === status;
    return matchesSearch && matchesStatus;
  });
  res.json(filtered);
});

router.post('/', (req, res) => {
  const { vehicleId, serviceType, serviceCost, notes } = req.body;
  if (!vehicleId || !serviceType || !serviceCost) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newRecord = {
    id: maintenanceRecords.length + 1,
    vehicleId,
    serviceType,
    serviceCost: Number(serviceCost),
    serviceDate: new Date().toISOString().split('T')[0],
    maintenanceStatus: 'In Progress',
    notes: notes || '',
  };
  maintenanceRecords.push(newRecord);
  res.status(201).json(newRecord);
});

router.post('/:id/complete', (req, res) => {
  const record = maintenanceRecords.find((r) => r.id === Number(req.params.id));
  if (!record) return res.status(404).json({ error: 'Record not found' });
  record.maintenanceStatus = 'Completed';
  res.json(record);
});

module.exports = router;

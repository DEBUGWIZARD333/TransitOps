const express = require('express');
const router = express.Router();
const { trips } = require('../models/db');

router.get('/', (req, res) => {
  const { search = '', status = '' } = req.query;
  const filtered = trips.filter((trip) => {
    const matchesSearch = `${trip.tripNumber} ${trip.source} ${trip.destination}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || trip.dispatchStatus === status;
    return matchesSearch && matchesStatus;
  });
  res.json(filtered);
});

router.post('/', (req, res) => {
  const { source, destination, cargoWeight, plannedDistance, assignedVehicle, assignedDriver } = req.body;
  if (!source || !destination || !cargoWeight || !plannedDistance) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newTrip = {
    id: trips.length + 1,
    tripNumber: `TR-2024-${String(trips.length + 1).padStart(3, '0')}`,
    source,
    destination,
    cargoWeight: Number(cargoWeight),
    plannedDistance: Number(plannedDistance),
    assignedVehicle: assignedVehicle || null,
    assignedDriver: assignedDriver || null,
    dispatchStatus: 'Pending',
    createdAt: new Date().toISOString().split('T')[0],
  };
  trips.push(newTrip);
  res.status(201).json(newTrip);
});

router.post('/:id/dispatch', (req, res) => {
  const trip = trips.find((t) => t.id === Number(req.params.id));
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.dispatchStatus = 'In Progress';
  res.json(trip);
});

router.post('/:id/complete', (req, res) => {
  const trip = trips.find((t) => t.id === Number(req.params.id));
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.dispatchStatus = 'Completed';
  res.json(trip);
});

router.post('/:id/cancel', (req, res) => {
  const trip = trips.find((t) => t.id === Number(req.params.id));
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.dispatchStatus = 'Cancelled';
  res.json(trip);
});

module.exports = router;

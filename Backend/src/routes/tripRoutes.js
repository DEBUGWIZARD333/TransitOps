const express = require('express');
const router = express.Router();

const trips = [
  {
    id: 1,
    tripNumber: 'TR-2024-001',
    source: 'Lagos Central',
    destination: 'Ibadan Hub',
    cargoWeight: 1200,
    plannedDistance: 125,
    assignedVehicle: 'TR-001',
    assignedDriver: 'DL-1201',
    dispatchStatus: 'Completed',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    tripNumber: 'TR-2024-002',
    source: 'Ibadan Hub',
    destination: 'Oyo Terminal',
    cargoWeight: 800,
    plannedDistance: 85,
    assignedVehicle: 'TR-002',
    assignedDriver: 'DL-1202',
    dispatchStatus: 'In Progress',
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    tripNumber: 'TR-2024-003',
    source: 'Oyo Terminal',
    destination: 'Lagos Central',
    cargoWeight: 1500,
    plannedDistance: 110,
    assignedVehicle: null,
    assignedDriver: null,
    dispatchStatus: 'Pending',
    createdAt: '2024-01-22',
  },
];

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

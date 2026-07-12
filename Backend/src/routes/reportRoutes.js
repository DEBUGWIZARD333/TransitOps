const express = require('express');
const router = express.Router();

router.get('/kpis', (req, res) => {
  res.json({
    totalRevenue: 485000,
    operationalCost: 125000,
    roi: 287,
    fleetUtilization: 78,
    fuelEfficiency: 8.5,
    maintenanceCost: 45000,
  });
});

router.get('/fleet-utilization', (req, res) => {
  res.json({
    available: 42,
    onTrip: 18,
    inMaintenance: 8,
    retired: 2,
  });
});

router.get('/operational-metrics', (req, res) => {
  res.json({
    completedTrips: 156,
    activeTrips: 18,
    averageTripDistance: 125,
    totalTripDistance: 19500,
    onTimeDelivery: 94,
  });
});

router.get('/', (req, res) => {
  res.json({
    period: 'monthly',
    summary: {
      revenue: 485000,
      expenses: 125000,
      profit: 360000,
    },
    trips: {
      completed: 156,
      active: 18,
      cancelled: 3,
    },
  });
});

module.exports = router;

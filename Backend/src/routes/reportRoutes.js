const express = require('express');
const router = express.Router();
const { vehicles, trips, expenses, maintenanceRecords } = require('../models/db');

router.get('/kpis', (req, res) => {
  const totalRevenue = trips
    .filter(t => t.dispatchStatus === 'Completed' || t.dispatchStatus === 'In Progress')
    .reduce((sum, t) => sum + (t.cargoWeight * 3 + t.plannedDistance * 15), 0);
    
  const operationalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const roi = operationalCost > 0 ? Math.round(((totalRevenue - operationalCost) / operationalCost) * 100) : 0;
  
  const activeVehiclesCount = vehicles.filter(v => v.status !== 'Retired').length;
  const fleetUtilization = activeVehiclesCount > 0 
    ? Math.round((vehicles.filter(v => v.status === 'On Trip').length / activeVehiclesCount) * 100)
    : 0;
    
  const maintenanceCost = maintenanceRecords.reduce((sum, r) => sum + r.serviceCost, 0);

  res.json({
    totalRevenue,
    operationalCost,
    roi,
    fleetUtilization,
    fuelEfficiency: 8.5,
    maintenanceCost,
  });
});

router.get('/fleet-utilization', (req, res) => {
  res.json({
    available: vehicles.filter(v => v.status === 'Available').length,
    onTrip: vehicles.filter(v => v.status === 'On Trip').length,
    inMaintenance: vehicles.filter(v => v.status === 'In Shop').length,
    retired: vehicles.filter(v => v.status === 'Retired').length,
  });
});

router.get('/operational-metrics', (req, res) => {
  const completedTrips = trips.filter(t => t.dispatchStatus === 'Completed').length;
  const activeTrips = trips.filter(t => t.dispatchStatus === 'In Progress').length;
  const totalTripDistance = trips.reduce((sum, t) => sum + t.plannedDistance, 0);
  const averageTripDistance = trips.length > 0 ? Math.round(totalTripDistance / trips.length) : 0;
  
  res.json({
    completedTrips,
    activeTrips,
    averageTripDistance,
    totalTripDistance,
    onTimeDelivery: 94,
  });
});

router.get('/', (req, res) => {
  const revenue = trips
    .filter(t => t.dispatchStatus === 'Completed' || t.dispatchStatus === 'In Progress')
    .reduce((sum, t) => sum + (t.cargoWeight * 3 + t.plannedDistance * 15), 0);
  const operationalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  res.json({
    period: 'monthly',
    summary: {
      revenue,
      expenses: operationalCost,
      profit: revenue - operationalCost,
    },
    trips: {
      completed: trips.filter(t => t.dispatchStatus === 'Completed').length,
      active: trips.filter(t => t.dispatchStatus === 'In Progress').length,
      cancelled: trips.filter(t => t.dispatchStatus === 'Cancelled').length,
    },
  });
});

module.exports = router;

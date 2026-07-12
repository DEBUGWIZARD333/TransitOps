const dashboardData = {
  kpis: {
    activeVehicles: 128,
    availableVehicles: 84,
    vehiclesInMaintenance: 12,
    activeTrips: 36,
    pendingTrips: 9,
    driversOnDuty: 27,
    fleetUtilization: 78,
  },
  trips: [
    { trip: 'TR001', vehicle: 'VAN-05', driver: 'Alex', status: 'On Trip', eta: '45 min' },
    { trip: 'TR002', vehicle: 'TRK-12', driver: 'John', status: 'Completed', eta: '-' },
    { trip: 'TR003', vehicle: 'MINI-08', driver: 'Priya', status: 'Dispatched', eta: '1h 10m' },
    { trip: 'TR004', vehicle: '-', driver: '-', status: 'Draft', eta: 'Awaiting vehicle' },
  ],
  vehicleStatus: [
    { label: 'Available', percent: 80, color: 'green' },
    { label: 'On Trip', percent: 40, color: 'blue' },
    { label: 'In Shop', percent: 10, color: 'orange' },
    { label: 'Retired', percent: 5, color: 'red' },
  ],
};

function getDashboardSummary() {
  return dashboardData;
}

module.exports = { getDashboardSummary };

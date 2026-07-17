const { vehicles, drivers, trips } = require('../models/db');

function getDashboardSummary() {
  const activeVehiclesCount = vehicles.filter(v => v.status !== 'Retired').length;
  const availableVehiclesCount = vehicles.filter(v => v.status === 'Available').length;
  const vehiclesInMaintenanceCount = vehicles.filter(v => v.status === 'In Shop').length;
  
  const activeTripsCount = trips.filter(t => t.dispatchStatus === 'In Progress').length;
  const pendingTripsCount = trips.filter(t => t.dispatchStatus === 'Pending').length;
  
  const driversOnDutyCount = drivers.filter(d => d.status === 'On Trip').length;
  
  const utilization = activeVehiclesCount > 0 
    ? Math.round((vehicles.filter(v => v.status === 'On Trip').length / activeVehiclesCount) * 100) 
    : 0;

  const dynamicKpis = {
    activeVehicles: activeVehiclesCount,
    availableVehicles: availableVehiclesCount,
    vehiclesInMaintenance: vehiclesInMaintenanceCount,
    activeTrips: activeTripsCount,
    pendingTrips: pendingTripsCount,
    totalDrivers: drivers.length,
    driversOnDuty: driversOnDutyCount,
    fleetUtilization: utilization,
  };

  const dynamicTrips = trips.map(t => {
    const driverObj = drivers.find(d => d.licenseNumber === t.assignedDriver);
    return {
      trip: t.tripNumber,
      vehicle: t.assignedVehicle || '-',
      driver: driverObj ? driverObj.driverName : '-',
      status: t.dispatchStatus === 'In Progress' ? 'On Trip' : t.dispatchStatus,
      eta: t.dispatchStatus === 'In Progress' ? '45 min' : t.dispatchStatus === 'Pending' ? 'Awaiting dispatch' : '-'
    };
  });

  const totalVehicles = vehicles.length || 1;
  const availablePct = Math.round((vehicles.filter(v => v.status === 'Available').length / totalVehicles) * 100);
  const onTripPct = Math.round((vehicles.filter(v => v.status === 'On Trip').length / totalVehicles) * 100);
  const inShopPct = Math.round((vehicles.filter(v => v.status === 'In Shop').length / totalVehicles) * 100);
  const retiredPct = Math.round((vehicles.filter(v => v.status === 'Retired').length / totalVehicles) * 100);

  const dynamicVehicleStatus = [
    { label: 'Available', percent: availablePct, color: 'green' },
    { label: 'On Trip', percent: onTripPct, color: 'blue' },
    { label: 'In Shop', percent: inShopPct, color: 'orange' },
    { label: 'Retired', percent: retiredPct, color: 'red' },
  ];

  return {
    kpis: dynamicKpis,
    trips: dynamicTrips,
    vehicleStatus: dynamicVehicleStatus
  };
}

module.exports = { getDashboardSummary };

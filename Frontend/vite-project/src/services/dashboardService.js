const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const buildQueryString = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return query ? `?${query}` : '';
};

export const fetchDashboardKpis = async (filters = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/kpis${buildQueryString(filters)}`);
    if (!response.ok) {
      throw new Error('Unable to load dashboard KPIs');
    }
    return response.json();
  } catch {
    return {
      activeVehicles: 128,
      availableVehicles: 84,
      vehiclesInMaintenance: 12,
      activeTrips: 36,
      pendingTrips: 9,
      driversOnDuty: 27,
      fleetUtilization: 78,
    };
  }
};

export const fetchFleetUtilizationSeries = async (filters = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/utilization${buildQueryString(filters)}`);
    if (!response.ok) {
      throw new Error('Unable to load utilization trend');
    }
    return response.json();
  } catch {
    return [
      { period: 'Jan', utilization: 72 },
      { period: 'Feb', utilization: 74 },
      { period: 'Mar', utilization: 76 },
      { period: 'Apr', utilization: 71 },
      { period: 'May', utilization: 79 },
      { period: 'Jun', utilization: 82 },
    ];
  }
};

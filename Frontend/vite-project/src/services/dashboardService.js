import api from './api';

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
  const response = await api.get(`/dashboard/kpis${buildQueryString(filters)}`);
  return response.data;
};

export const fetchDashboardTrips = async (filters = {}) => {
  const response = await api.get(`/dashboard/trips${buildQueryString(filters)}`);
  return response.data;
};

export const fetchVehicleStatus = async (filters = {}) => {
  const response = await api.get(`/dashboard/vehicle-status${buildQueryString(filters)}`);
  return response.data;
};

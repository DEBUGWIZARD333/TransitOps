import api from './api';

export const fetchVehicles = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await api.get(`/fleet/vehicles${query ? `?${query}` : ''}`);
  return response.data;
};

export const createVehicle = async (payload) => {
  const response = await api.post('/fleet/vehicles', payload);
  return response.data;
};

export const updateVehicle = async (id, payload) => {
  const response = await api.put(`/fleet/vehicles/${id}`, payload);
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(`/fleet/vehicles/${id}`);
  return response.data;
};

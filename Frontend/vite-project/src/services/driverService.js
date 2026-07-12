import api from './api';

export const fetchDrivers = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await api.get(`/drivers${query ? `?${query}` : ''}`);
  return response.data;
};

export const createDriver = async (payload) => {
  const response = await api.post('/drivers', payload);
  return response.data;
};

export const updateDriver = async (id, payload) => {
  const response = await api.put(`/drivers/${id}`, payload);
  return response.data;
};

export const deleteDriver = async (id) => {
  const response = await api.delete(`/drivers/${id}`);
  return response.data;
};

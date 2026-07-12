import api from './api';

export const fetchMaintenanceRecords = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await api.get(`/maintenance${query ? `?${query}` : ''}`);
  return response.data;
};

export const createMaintenanceRecord = async (payload) => {
  const response = await api.post('/maintenance', payload);
  return response.data;
};

export const updateMaintenanceRecord = async (id, payload) => {
  const response = await api.put(`/maintenance/${id}`, payload);
  return response.data;
};

export const completeMaintenanceRecord = async (id) => {
  const response = await api.post(`/maintenance/${id}/complete`, {});
  return response.data;
};

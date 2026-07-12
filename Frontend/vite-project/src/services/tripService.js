import api from './api';

export const fetchTrips = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await api.get(`/trips${query ? `?${query}` : ''}`);
  return response.data;
};

export const createTrip = async (payload) => {
  const response = await api.post('/trips', payload);
  return response.data;
};

export const updateTrip = async (id, payload) => {
  const response = await api.put(`/trips/${id}`, payload);
  return response.data;
};

export const dispatchTrip = async (id) => {
  const response = await api.post(`/trips/${id}/dispatch`, {});
  return response.data;
};

export const completeTrip = async (id) => {
  const response = await api.post(`/trips/${id}/complete`, {});
  return response.data;
};

export const cancelTrip = async (id) => {
  const response = await api.post(`/trips/${id}/cancel`, {});
  return response.data;
};

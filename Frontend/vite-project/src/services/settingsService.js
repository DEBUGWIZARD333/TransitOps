import api from './api';

export const fetchSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (payload) => {
  const response = await api.put('/settings', payload);
  return response.data;
};

export const fetchRolePermissions = async () => {
  const response = await api.get('/settings/role-permissions');
  return response.data;
};

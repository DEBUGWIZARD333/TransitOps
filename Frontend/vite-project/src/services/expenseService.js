import api from './api';

export const fetchFuelExpenses = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await api.get(`/expenses${query ? `?${query}` : ''}`);
  return response.data;
};

export const createFuelExpense = async (payload) => {
  const response = await api.post('/expenses/fuel', payload);
  return response.data;
};

export const createExpense = async (payload) => {
  const response = await api.post('/expenses', payload);
  return response.data;
};

export const fetchExpensesSummary = async () => {
  const response = await api.get('/expenses/summary');
  return response.data;
};

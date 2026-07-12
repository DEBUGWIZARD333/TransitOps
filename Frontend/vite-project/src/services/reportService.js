import api from './api';

export const fetchReportsData = async (period = 'monthly') => {
  const response = await api.get(`/reports?period=${period}`);
  return response.data;
};

export const fetchAnalyticsKPIs = async () => {
  const response = await api.get('/analytics/kpis');
  return response.data;
};

export const fetchFleetUtilization = async () => {
  const response = await api.get('/analytics/fleet-utilization');
  return response.data;
};

export const fetchOperationalMetrics = async () => {
  const response = await api.get('/analytics/operational-metrics');
  return response.data;
};

import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../../components/common/Card';
import Header from '../../components/common/Header';
import { fetchDashboardKpis, fetchFleetUtilizationSeries } from '../../services/dashboardService';

const kpiConfig = [
  { key: 'activeVehicles', label: 'Active Vehicles' },
  { key: 'availableVehicles', label: 'Available Vehicles' },
  { key: 'vehiclesInMaintenance', label: 'Vehicles in Maintenance' },
  { key: 'activeTrips', label: 'Active Trips' },
  { key: 'pendingTrips', label: 'Pending Trips' },
  { key: 'driversOnDuty', label: 'Drivers On Duty' },
  { key: 'fleetUtilization', label: 'Fleet Utilization %' },
];

const DashboardPage = () => {
  const [filters, setFilters] = useState({ vehicleType: '', status: '', region: '' });
  const [kpis, setKpis] = useState({});
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const [kpiData, utilizationData] = await Promise.all([
        fetchDashboardKpis(filters),
        fetchFleetUtilizationSeries(filters),
      ]);
      setKpis(kpiData);
      setSeries(utilizationData);
      setLoading(false);
    };

    loadDashboard();
  }, [filters]);

  const kpiCards = useMemo(() => kpiConfig.map((item) => ({ ...item, value: kpis[item.key] })), [kpis]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <Header title="Fleet Dashboard" subtitle="Operational performance across your transport network" />

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <label className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Vehicle Type</span>
          <select name="vehicleType" value={filters.vehicleType} onChange={handleFilterChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
            <option value="">All Types</option>
            <option value="bus">Bus</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
          </select>
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Status</span>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="idle">Idle</option>
          </select>
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-2 block font-medium text-slate-700">Region</span>
          <select name="region" value={filters.region} onChange={handleFilterChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
            <option value="">All Regions</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="west">West</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((item) => (
          <Card key={item.key} title={item.label}>
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
            ) : (
              <p className="text-3xl font-semibold text-slate-900">{item.label === 'Fleet Utilization %' ? `${item.value}%` : item.value}</p>
            )}
          </Card>
        ))}
      </div>

      <Card title="Fleet Utilization Trend">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="utilizationFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="utilization" stroke="#0f172a" fill="url(#utilizationFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import { fetchDashboardKpis, fetchDashboardTrips, fetchVehicleStatus } from '../../services/dashboardService';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardPage.css';

const kpiConfig = [
  { key: 'activeVehicles', label: 'ACTIVE VEHICLES', color: 'indigo' },
  { key: 'availableVehicles', label: 'AVAILABLE VEHICLES', color: 'emerald' },
  { key: 'vehiclesInMaintenance', label: 'IN MAINTENANCE', color: 'rose' },
  { key: 'activeTrips', label: 'ACTIVE TRIPS', color: 'blue' },
  { key: 'pendingTrips', label: 'PENDING TRIPS', color: 'amber' },
  { key: 'totalDrivers', label: 'TOTAL DRIVERS', color: 'cyan' },
  { key: 'driversOnDuty', label: 'DRIVERS ON DUTY', color: 'purple' },
  { key: 'fleetUtilization', label: 'UTILIZATION', color: 'emerald' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const DashboardPage = () => {
  const [filters, setFilters] = useState({ vehicleType: '', status: '', region: '' });
  const [kpis, setKpis] = useState({});
  const [trips, setTrips] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth() || { user: { role: 'Fleet Manager' } };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [kpiData, tripsData, vehicleStatusData] = await Promise.all([
          fetchDashboardKpis(filters),
          fetchDashboardTrips(filters),
          fetchVehicleStatus(filters),
        ]);
        setKpis(kpiData);
        setTrips(tripsData);
        setVehicleStatus(vehicleStatusData);
        setError('');
      } catch (e) {
        setError('Unable to load dashboard data.');
      }
      setLoading(false);
    };

    loadDashboard();
  }, [filters]);

  const kpiCards = useMemo(() => kpiConfig.map((item) => ({ ...item, value: kpis[item.key] || '0' })), [kpis]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Trip':
      case 'Dispatched':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const getColorClass = (color) => {
    const colorMap = {
      indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/20',
      emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20',
      rose: 'from-rose-500 to-rose-600 shadow-rose-500/20',
      blue: 'from-blue-500 to-blue-600 shadow-blue-500/20',
      amber: 'from-amber-500 to-amber-600 shadow-amber-500/20',
      purple: 'from-purple-500 to-purple-600 shadow-purple-500/20',
      cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-500/20',
    };
    return colorMap[color] || colorMap.indigo;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <Header title="Dashboard Overview" subtitle="Real-time insights and operational metrics" />

      {/* FILTERS */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center"
      >
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filters</span>
        <select name="vehicleType" value={filters.vehicleType} onChange={handleFilterChange} className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
          <option value="">All Vehicles</option>
          <option value="bus">Bus</option>
          <option value="truck">Truck</option>
          <option value="van">Van</option>
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="idle">Idle</option>
        </select>
        <select name="region" value={filters.region} onChange={handleFilterChange} className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
          <option value="">All Regions</option>
          <option value="north">North</option>
          <option value="south">South</option>
          <option value="west">West</option>
        </select>
      </motion.div>

      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">{error}</div> : null}
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : null}

      {/* KPI CARDS */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
      >
        {kpiCards.map((item) => (
          <motion.div key={item.key} variants={itemVariants} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getColorClass(item.color)} p-5 text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl`}>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="text-[10px] font-bold tracking-widest opacity-80 uppercase leading-tight mb-2">{item.label}</div>
              <div className="text-3xl font-black tracking-tight">
                {item.label === 'UTILIZATION' ? `${item.value}%` : (item.value < 10 && item.value > 0 ? `0${item.value}` : item.value)}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* RECENT TRIPS */}
        <div className="lg:col-span-2">
          <Card title="Recent Trips">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="pb-3 font-semibold">Trip ID</th>
                    <th className="pb-3 font-semibold">Vehicle</th>
                    <th className="pb-3 font-semibold">Driver</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">ETA</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {trips.map((trip, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx} 
                      className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 font-medium">{trip.trip}</td>
                      <td className="py-3">{trip.vehicle}</td>
                      <td className="py-3">{trip.driver}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">{trip.eta}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* VEHICLE STATUS */}
        <div>
          <Card title="Fleet Status">
            <div className="flex flex-col gap-5 mt-2">
              {vehicleStatus.map((status, idx) => {
                const getBarColor = (colorClass) => {
                  if(colorClass.includes('green')) return 'bg-emerald-500';
                  if(colorClass.includes('blue')) return 'bg-indigo-500';
                  if(colorClass.includes('orange')) return 'bg-amber-500';
                  if(colorClass.includes('red')) return 'bg-rose-500';
                  return 'bg-slate-500';
                };
                
                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{status.label}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{status.percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${status.percent}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 + (idx * 0.1) }}
                        className={`h-full rounded-full ${getBarColor(status.color)}`}
                      ></motion.div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

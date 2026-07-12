import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/common/Header';
import { fetchDashboardKpis, fetchDashboardTrips, fetchVehicleStatus } from '../../services/dashboardService';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardPage.css';

const kpiConfig = [
  { key: 'activeVehicles', label: 'ACTIVE VEHICLES', color: 'blue' },
  { key: 'availableVehicles', label: 'AVAILABLE VEHICLES', color: 'green' },
  { key: 'vehiclesInMaintenance', label: 'VEHICLES IN MAINTENANCE', color: 'orange' },
  { key: 'activeTrips', label: 'ACTIVE TRIPS', color: 'blue' },
  { key: 'pendingTrips', label: 'PENDING TRIPS', color: 'blue' },
  { key: 'driversOnDuty', label: 'DRIVERS ON DUTY', color: 'blue' },
  { key: 'fleetUtilization', label: 'FLEET UTILIZATION', color: 'green' },
];

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

  const getStatusPillColor = (status) => {
    switch (status) {
      case 'On Trip':
      case 'Dispatched':
        return 'blue';
      case 'Completed':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div className="dashboard-container">
      <Header title="Dashboard" subtitle="" />

      {/* FILTERS */}
      <div>
        <div className="filters-header">Filters</div>
        <div className="filters-row">
          <select name="vehicleType" value={filters.vehicleType} onChange={handleFilterChange} className="filter-select">
            <option value="">Vehicle Type: All</option>
            <option value="bus">Bus</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
          </select>

          <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
            <option value="">Status: All</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="idle">Idle</option>
          </select>

          <select name="region" value={filters.region} onChange={handleFilterChange} className="filter-select">
            <option value="">Region: All</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="west">West</option>
          </select>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      {loading ? <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">Loading dashboard...</div> : null}

      {/* KPI CARDS */}
      <div className="kpi-grid">
        {kpiCards.map((item) => (
          <div key={item.key} className={`kpi-card ${item.color}`}>
            <div className="kpi-label">{item.label}</div>
            <div className="kpi-value">
              {item.label === 'FLEET UTILIZATION' ? `${item.value}%` : (item.value < 10 && item.value > 0 ? `0${item.value}` : item.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="main-content-grid">
        {/* RECENT TRIPS */}
        <div className="recent-trips-section">
          <h3 className="section-title">Recent Trips</h3>
          <div className="table-container">
            <table className="trips-table">
              <thead>
                <tr>
                  <th>Trip</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th className="right-align">ETA</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip, idx) => (
                  <tr key={idx}>
                    <td>{trip.trip}</td>
                    <td>{trip.vehicle}</td>
                    <td>{trip.driver}</td>
                    <td>
                      <span className={`status-pill ${getStatusPillColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="right-align">{trip.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* VEHICLE STATUS */}
        <div>
          <h3 className="section-title">Vehicle Status</h3>
          <div className="vehicle-status-list">
            {vehicleStatus.map((status, idx) => (
              <div key={idx} className="status-row">
                <div className="status-label">{status.label}</div>
                <div className="progress-bar-container">
                  <div className={`progress-bar-fill ${status.color}`} style={{ width: `${status.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

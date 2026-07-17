import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Header from '../../components/common/Header';
import { fetchAnalyticsKPIs, fetchFleetUtilization, fetchOperationalMetrics } from '../../services/reportService';
import { useSettings } from '../../contexts/SettingsContext';

const FleetAnalyticsPage = () => {
  const { formatMoney } = useSettings() || {
    formatMoney: (val) => `₦${Number(val).toLocaleString()}`
  };
  const [kpis, setKpis] = useState(null);
  const [fleetData, setFleetData] = useState(null);
  const [operationalData, setOperationalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [kpiData, fleetUtilData, opMetricsData] = await Promise.all([
          fetchAnalyticsKPIs(),
          fetchFleetUtilization(),
          fetchOperationalMetrics(),
        ]);
        setKpis(kpiData);
        setFleetData(fleetUtilData);
        setOperationalData(opMetricsData);
        setError('');
      } catch (err) {
        setError(err.message || 'Unable to load analytics');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-6 text-center text-slate-500">Loading analytics...</div>;
  if (error) return <div className="p-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-700">{error}</div>;

  return (
    <div className="space-y-6">
      <Header title="Reports & Analytics" subtitle="Performance metrics and operational insights" />

      {/* KPI Cards */}
      {kpis ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-3xl font-semibold text-emerald-600">{formatMoney(kpis.totalRevenue)}</p>
            </div>
          </Card>
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Operational Cost</p>
              <p className="text-3xl font-semibold text-orange-600">{formatMoney(kpis.operationalCost)}</p>
            </div>
          </Card>
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">ROI</p>
              <p className="text-3xl font-semibold text-blue-600">{kpis.roi}%</p>
            </div>
          </Card>
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Fleet Utilization</p>
              <p className="text-3xl font-semibold text-sky-600">{kpis.fleetUtilization}%</p>
            </div>
          </Card>
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Fuel Efficiency (km/L)</p>
              <p className="text-3xl font-semibold text-purple-600">{kpis.fuelEfficiency}</p>
            </div>
          </Card>
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Maintenance Cost</p>
              <p className="text-3xl font-semibold text-rose-600">{formatMoney(kpis.maintenanceCost)}</p>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Fleet Utilization */}
      {fleetData ? (
        <Card title="Fleet Status">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700 font-semibold">Available</p>
              <p className="text-2xl font-bold text-emerald-900">{fleetData.available}</p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
              <p className="text-sm text-sky-700 font-semibold">On Trip</p>
              <p className="text-2xl font-bold text-sky-900">{fleetData.onTrip}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-700 font-semibold">In Maintenance</p>
              <p className="text-2xl font-bold text-amber-900">{fleetData.inMaintenance}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-700 font-semibold">Retired</p>
              <p className="text-2xl font-bold text-slate-900">{fleetData.retired}</p>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Operational Metrics */}
      {operationalData ? (
        <Card title="Operational Performance">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Completed Trips</span>
                <span className="font-semibold text-slate-900">{operationalData.completedTrips}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Active Trips</span>
                <span className="font-semibold text-slate-900">{operationalData.activeTrips}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Average Trip Distance</span>
                <span className="font-semibold text-slate-900">{operationalData.averageTripDistance} km</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Trip Distance</span>
                <span className="font-semibold text-slate-900">{operationalData.totalTripDistance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">On-Time Delivery Rate</span>
                <span className="font-semibold text-emerald-600">{operationalData.onTimeDelivery}%</span>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default FleetAnalyticsPage;

import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import Header from '../../components/common/Header';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import StatusBadge from '../../components/common/StatusBadge';
import { fetchTrips, createTrip, dispatchTrip, completeTrip, cancelTrip } from '../../services/tripService';

const TripListPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ source: '', destination: '', cargoWeight: '', plannedDistance: '', assignedVehicle: '', assignedDriver: '' });
  const [formErrors, setFormErrors] = useState({});

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await fetchTrips({ search, status: status === 'All' ? '' : status });
      setTrips(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [search, status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.source.trim()) nextErrors.source = 'Source is required';
    if (!form.destination.trim()) nextErrors.destination = 'Destination is required';
    if (!form.cargoWeight) nextErrors.cargoWeight = 'Cargo weight is required';
    if (!form.plannedDistance) nextErrors.plannedDistance = 'Planned distance is required';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createTrip({ ...form, cargoWeight: Number(form.cargoWeight), plannedDistance: Number(form.plannedDistance) });
      setIsModalOpen(false);
      setForm({ source: '', destination: '', cargoWeight: '', plannedDistance: '', assignedVehicle: '', assignedDriver: '' });
      loadTrips();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Unable to create trip' });
    }
  };

  const handleDispatch = async (tripId) => {
    try {
      await dispatchTrip(tripId);
      loadTrips();
    } catch (err) {
      setError(err.message || 'Unable to dispatch trip');
    }
  };

  const handleComplete = async (tripId) => {
    try {
      await completeTrip(tripId);
      loadTrips();
    } catch (err) {
      setError(err.message || 'Unable to complete trip');
    }
  };

  const handleCancel = async (tripId) => {
    try {
      await cancelTrip(tripId);
      loadTrips();
    } catch (err) {
      setError(err.message || 'Unable to cancel trip');
    }
  };

  const columns = useMemo(() => [
    { key: 'tripNumber', label: 'Trip Number' },
    { key: 'source', label: 'Source' },
    { key: 'destination', label: 'Destination' },
    { key: 'cargoWeight', label: 'Cargo Weight (kg)' },
    { key: 'plannedDistance', label: 'Distance (km)' },
    { key: 'assignedVehicle', label: 'Vehicle', render: (row) => row.assignedVehicle || '—' },
    { key: 'assignedDriver', label: 'Driver', render: (row) => row.assignedDriver || '—' },
    { key: 'dispatchStatus', label: 'Status', render: (row) => <StatusBadge status={row.dispatchStatus} /> },
    { key: 'actions', label: 'Actions', render: (row) => (
      <div className="flex gap-2">
        {row.dispatchStatus === 'Pending' && <button onClick={() => handleDispatch(row.id)} className="rounded-lg border border-sky-200 p-1 text-sky-600 text-xs hover:bg-sky-50">Dispatch</button>}
        {row.dispatchStatus === 'In Progress' && <button onClick={() => handleComplete(row.id)} className="rounded-lg border border-emerald-200 p-1 text-emerald-600 text-xs hover:bg-emerald-50">Complete</button>}
        {row.dispatchStatus !== 'Completed' && <button onClick={() => handleCancel(row.id)} className="rounded-lg border border-rose-200 p-1 text-rose-600 text-xs hover:bg-rose-50">Cancel</button>}
      </div>
    ) },
  ], []);

  return (
    <div className="space-y-6">
      <Header title="Trip Dispatcher" subtitle="Create, track, and manage transport trips" />
      <Card title="Active Trips">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
            <div className="min-w-[220px] flex-1">
              <SearchInput value={search} onChange={setSearch} placeholder="Search trip" />
            </div>
            <label className="text-sm text-slate-600">
              <span className="mb-2 block font-medium text-slate-700">Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
                {['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-full">
            <Plus size={16} /> New Trip
          </Button>
        </div>

        {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        {loading ? <div className="mt-4 text-sm text-slate-500">Loading trips...</div> : null}
        <div className="mt-6">
          <DataTable columns={columns} rows={trips} emptyMessage="No trips found." />
        </div>
        <p className="mt-4 text-sm text-slate-500">Cargo weight must not exceed vehicle capacity. Retired or in-maintenance vehicles cannot be dispatched.</p>
      </Card>

      {isModalOpen ? (
        <Modal title="Create New Trip" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.submit ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formErrors.submit}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Source</span>
                <input value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.source ? <p className="mt-1 text-xs text-rose-600">{formErrors.source}</p> : null}
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Destination</span>
                <input value={form.destination} onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.destination ? <p className="mt-1 text-xs text-rose-600">{formErrors.destination}</p> : null}
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Cargo Weight (kg)</span>
                <input type="number" value={form.cargoWeight} onChange={(event) => setForm((current) => ({ ...current, cargoWeight: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.cargoWeight ? <p className="mt-1 text-xs text-rose-600">{formErrors.cargoWeight}</p> : null}
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Planned Distance (km)</span>
                <input type="number" value={form.plannedDistance} onChange={(event) => setForm((current) => ({ ...current, plannedDistance: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.plannedDistance ? <p className="mt-1 text-xs text-rose-600">{formErrors.plannedDistance}</p> : null}
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
              <Button type="submit">Create Trip</Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default TripListPage;

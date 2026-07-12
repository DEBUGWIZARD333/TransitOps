import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import Header from '../../components/common/Header';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import { fetchMaintenanceRecords, createMaintenanceRecord, completeMaintenanceRecord } from '../../services/maintenanceService';

const MaintenanceDashboardPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ vehicleId: '', serviceType: 'Oil Change', serviceCost: '', notes: '' });
  const [formErrors, setFormErrors] = useState({});

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await fetchMaintenanceRecords({ search, status: status === 'All' ? '' : status });
      setRecords(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [search, status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.vehicleId.trim()) nextErrors.vehicleId = 'Vehicle ID is required';
    if (!form.serviceType.trim()) nextErrors.serviceType = 'Service type is required';
    if (!form.serviceCost) nextErrors.serviceCost = 'Service cost is required';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createMaintenanceRecord({ ...form, serviceCost: Number(form.serviceCost) });
      setIsModalOpen(false);
      setForm({ vehicleId: '', serviceType: 'Oil Change', serviceCost: '', notes: '' });
      loadRecords();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Unable to create record' });
    }
  };

  const handleComplete = async (recordId) => {
    try {
      await completeMaintenanceRecord(recordId);
      loadRecords();
    } catch (err) {
      setError(err.message || 'Unable to complete record');
    }
  };

  const columns = useMemo(() => [
    { key: 'vehicleId', label: 'Vehicle' },
    { key: 'serviceType', label: 'Service Type' },
    { key: 'serviceCost', label: 'Cost', render: (row) => `₦${Number(row.serviceCost).toLocaleString()}` },
    { key: 'serviceDate', label: 'Date' },
    { key: 'maintenanceStatus', label: 'Status', render: (row) => (
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.maintenanceStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
        {row.maintenanceStatus}
      </span>
    ) },
    { key: 'actions', label: 'Actions', render: (row) => (
      row.maintenanceStatus !== 'Completed' && (
        <button onClick={() => handleComplete(row.id)} className="rounded-lg border border-emerald-200 p-1 text-emerald-600 text-xs hover:bg-emerald-50">
          Mark Complete
        </button>
      )
    ) },
  ], []);

  return (
    <div className="space-y-6">
      <Header title="Maintenance Management" subtitle="Schedule, track, and log vehicle maintenance" />
      <Card title="Service Records">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
            <div className="min-w-[220px] flex-1">
              <SearchInput value={search} onChange={setSearch} placeholder="Search vehicle or service" />
            </div>
            <label className="text-sm text-slate-600">
              <span className="mb-2 block font-medium text-slate-700">Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
                {['All', 'In Progress', 'Completed'].map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-full">
            <Plus size={16} /> Log Maintenance
          </Button>
        </div>

        {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        {loading ? <div className="mt-4 text-sm text-slate-500">Loading records...</div> : null}
        <div className="mt-6">
          <DataTable columns={columns} rows={records} emptyMessage="No maintenance records found." />
        </div>
      </Card>

      {isModalOpen ? (
        <Modal title="Log Maintenance" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.submit ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formErrors.submit}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-600 md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700">Vehicle ID</span>
                <input value={form.vehicleId} onChange={(event) => setForm((current) => ({ ...current, vehicleId: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.vehicleId ? <p className="mt-1 text-xs text-rose-600">{formErrors.vehicleId}</p> : null}
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Service Type</span>
                <select value={form.serviceType} onChange={(event) => setForm((current) => ({ ...current, serviceType: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none">
                  {['Oil Change', 'Tire Replacement', 'Engine Repair', 'Battery Change', 'Inspection'].map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Service Cost (₦)</span>
                <input type="number" value={form.serviceCost} onChange={(event) => setForm((current) => ({ ...current, serviceCost: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.serviceCost ? <p className="mt-1 text-xs text-rose-600">{formErrors.serviceCost}</p> : null}
              </label>
              <label className="text-sm text-slate-600 md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700">Notes</span>
                <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
              <Button type="submit">Log Maintenance</Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default MaintenanceDashboardPage;

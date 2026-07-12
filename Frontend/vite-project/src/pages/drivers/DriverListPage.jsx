import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import Header from '../../components/common/Header';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import StatusBadge from '../../components/common/StatusBadge';
import { createDriver, fetchDrivers } from '../../services/driverService';

const statusOptions = ['All', 'Available', 'On Trip', 'Off Duty', 'Suspended'];

const DriverListPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ driverName: '', licenseNumber: '', licenseCategory: 'Class A', licenseExpiryDate: '', contactNumber: '', tripCompletionPercentage: '', safetyScore: '', status: 'Available' });
  const [formErrors, setFormErrors] = useState({});

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const data = await fetchDrivers({ search, status: status === 'All' ? '' : status });
      setDrivers(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, [search, status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.driverName.trim()) nextErrors.driverName = 'Driver name is required';
    if (!form.licenseNumber.trim()) nextErrors.licenseNumber = 'License number is required';
    if (!form.licenseExpiryDate) nextErrors.licenseExpiryDate = 'License expiry date is required';
    if (!form.contactNumber.trim()) nextErrors.contactNumber = 'Contact number is required';
    if (!form.status) nextErrors.status = 'Status is required';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createDriver({ ...form, tripCompletionPercentage: Number(form.tripCompletionPercentage || 0), safetyScore: Number(form.safetyScore || 0) });
      setIsModalOpen(false);
      setForm({ driverName: '', licenseNumber: '', licenseCategory: 'Class A', licenseExpiryDate: '', contactNumber: '', tripCompletionPercentage: '', safetyScore: '', status: 'Available' });
      loadDrivers();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Unable to register driver' });
    }
  };

  const columns = useMemo(() => [
    { key: 'driverName', label: 'Driver Name' },
    { key: 'licenseNumber', label: 'License Number' },
    { key: 'licenseCategory', label: 'License Category' },
    { key: 'licenseExpiryDate', label: 'License Expiry Date', render: (row) => <span className={new Date(row.licenseExpiryDate) < new Date() ? 'font-semibold text-rose-600' : 'text-slate-600'}>{row.licenseExpiryDate}</span> },
    { key: 'contactNumber', label: 'Contact Number' },
    { key: 'tripCompletionPercentage', label: 'Trip Completion Percentage' },
    { key: 'safetyScore', label: 'Safety Score' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ], []);

  return (
    <div className="space-y-6">
      <Header title="Driver Management" subtitle="Supervise driver availability, compliance, and trip readiness" />
      <Card title="Driver Directory">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
            <div className="min-w-[220px] flex-1">
              <SearchInput value={search} onChange={setSearch} placeholder="Search driver or license" />
            </div>
            <label className="text-sm text-slate-600">
              <span className="mb-2 block font-medium text-slate-700">Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
                {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-full">
            <Plus size={16} /> Add Driver
          </Button>
        </div>

        {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        {loading ? <div className="mt-4 text-sm text-slate-500">Loading drivers...</div> : null}
        <div className="mt-6">
          <DataTable columns={columns} rows={drivers} emptyMessage="No drivers found." />
        </div>
        <p className="mt-4 text-sm text-slate-500">Expired or suspended drivers cannot be assigned to trips.</p>
      </Card>

      {isModalOpen ? (
        <Modal title="Register New Driver" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.submit ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formErrors.submit}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-600 md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700">Driver Name</span>
                <input value={form.driverName} onChange={(event) => setForm((current) => ({ ...current, driverName: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.driverName ? <p className="mt-1 text-xs text-rose-600">{formErrors.driverName}</p> : null}
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">License Number</span>
                <input value={form.licenseNumber} onChange={(event) => setForm((current) => ({ ...current, licenseNumber: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.licenseNumber ? <p className="mt-1 text-xs text-rose-600">{formErrors.licenseNumber}</p> : null}
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">License Category</span>
                <input value={form.licenseCategory} onChange={(event) => setForm((current) => ({ ...current, licenseCategory: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">License Expiry Date</span>
                <input type="date" value={form.licenseExpiryDate} onChange={(event) => setForm((current) => ({ ...current, licenseExpiryDate: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.licenseExpiryDate ? <p className="mt-1 text-xs text-rose-600">{formErrors.licenseExpiryDate}</p> : null}
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Contact Number</span>
                <input value={form.contactNumber} onChange={(event) => setForm((current) => ({ ...current, contactNumber: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.contactNumber ? <p className="mt-1 text-xs text-rose-600">{formErrors.contactNumber}</p> : null}
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Status</span>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none">
                  {statusOptions.filter((option) => option !== 'All').map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Trip Completion Percentage</span>
                <input type="number" value={form.tripCompletionPercentage} onChange={(event) => setForm((current) => ({ ...current, tripCompletionPercentage: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Safety Score</span>
                <input type="number" value={form.safetyScore} onChange={(event) => setForm((current) => ({ ...current, safetyScore: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
              <Button type="submit">Register Driver</Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default DriverListPage;

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const DriverListPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ 
    driverName: '', email: '', password: '', licenseNumber: '', licenseCategory: 'Class A', 
    licenseExpiryDate: '', contactNumber: '', tripCompletionPercentage: '', safetyScore: '', status: 'Available' 
  });
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
    if (!form.email.trim()) nextErrors.email = 'Email address is required';
    if (!form.password) nextErrors.password = 'Password is required';
    if (!form.licenseNumber.trim()) nextErrors.licenseNumber = 'License number is required';
    if (!form.licenseExpiryDate) nextErrors.licenseExpiryDate = 'License expiry date is required';
    if (!form.contactNumber.trim()) nextErrors.contactNumber = 'Contact number is required';
    if (!form.status) nextErrors.status = 'Status is required';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createDriver({ ...form, tripCompletionPercentage: Number(form.tripCompletionPercentage || 0), safetyScore: Number(form.safetyScore || 0) });
      setIsModalOpen(false);
      setForm({ driverName: '', email: '', password: '', licenseNumber: '', licenseCategory: 'Class A', licenseExpiryDate: '', contactNumber: '', tripCompletionPercentage: '', safetyScore: '', status: 'Available' });
      loadDrivers();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Unable to register driver' });
    }
  };

  const columns = useMemo(() => [
    { key: 'driverName', label: 'Driver Name' },
    { key: 'licenseNumber', label: 'License Number' },
    { key: 'licenseCategory', label: 'License Category' },
    { key: 'licenseExpiryDate', label: 'License Expiry Date', render: (row) => <span className={new Date(row.licenseExpiryDate) < new Date() ? 'font-semibold text-rose-600' : 'text-slate-600 dark:text-slate-300'}>{row.licenseExpiryDate}</span> },
    { key: 'contactNumber', label: 'Contact Number' },
    { key: 'tripCompletionPercentage', label: 'Completion %', render: (row) => `${row.tripCompletionPercentage}%` },
    { key: 'safetyScore', label: 'Safety Score' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ], []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <Header title="Driver Management" subtitle="Supervise driver availability, compliance, and trip readiness" />
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Card title="Driver Directory">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-4">
            <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
              <div className="min-w-[220px] flex-1">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search</span>
                <SearchInput value={search} onChange={setSearch} placeholder="Search driver or license" />
              </div>
              <label className="text-sm">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status Filter</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
                  {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 font-medium shadow-md shadow-indigo-500/20"
            >
              <Plus size={18} /> Add Driver
            </motion.button>
          </div>

          {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">{error}</div> : null}
          {loading ? (
            <div className="flex justify-center items-center h-24">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : null}
          <div className="mt-2">
            <DataTable columns={columns} rows={drivers} emptyMessage="No drivers found." />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Expired or suspended drivers cannot be assigned to trips.</p>
        </Card>
      </motion.div>

      {isModalOpen ? (
        <Modal title="Register New Driver" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.submit ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formErrors.submit}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Driver Name</span>
                <input value={form.driverName} onChange={(event) => setForm((current) => ({ ...current, driverName: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.driverName ? <p className="mt-1 text-xs text-rose-600">{formErrors.driverName}</p> : null}
              </label>
              
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Email (Username)</span>
                <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.email ? <p className="mt-1 text-xs text-rose-600">{formErrors.email}</p> : null}
              </label>

              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Account Password</span>
                <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.password ? <p className="mt-1 text-xs text-rose-600">{formErrors.password}</p> : null}
              </label>

              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">License Number</span>
                <input value={form.licenseNumber} onChange={(event) => setForm((current) => ({ ...current, licenseNumber: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.licenseNumber ? <p className="mt-1 text-xs text-rose-600">{formErrors.licenseNumber}</p> : null}
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">License Category</span>
                <input value={form.licenseCategory} onChange={(event) => setForm((current) => ({ ...current, licenseCategory: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">License Expiry Date</span>
                <input type="date" value={form.licenseExpiryDate} onChange={(event) => setForm((current) => ({ ...current, licenseExpiryDate: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.licenseExpiryDate ? <p className="mt-1 text-xs text-rose-600">{formErrors.licenseExpiryDate}</p> : null}
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Contact Number</span>
                <input value={form.contactNumber} onChange={(event) => setForm((current) => ({ ...current, contactNumber: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.contactNumber ? <p className="mt-1 text-xs text-rose-600">{formErrors.contactNumber}</p> : null}
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Status</span>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  {statusOptions.filter((option) => option !== 'All').map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Trip Completion Percentage</span>
                <input type="number" value={form.tripCompletionPercentage} onChange={(event) => setForm((current) => ({ ...current, tripCompletionPercentage: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Safety Score</span>
                <input type="number" value={form.safetyScore} onChange={(event) => setForm((current) => ({ ...current, safetyScore: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancel</button>
              <button type="submit" className="rounded-lg bg-indigo-600 text-white px-5 py-2 text-sm font-medium hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition">Register Driver</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default DriverListPage;

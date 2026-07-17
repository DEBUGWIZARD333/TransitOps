import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import Header from '../../components/common/Header';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import { fetchMaintenanceRecords, createMaintenanceRecord, completeMaintenanceRecord } from '../../services/maintenanceService';
import { useSettings } from '../../contexts/SettingsContext';

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

const MaintenanceDashboardPage = () => {
  const { formatMoney, currencySymbol } = useSettings() || {
    formatMoney: (val) => `₦${Number(val).toLocaleString()}`,
    currencySymbol: '₦'
  };
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
    { key: 'serviceCost', label: 'Cost', render: (row) => formatMoney(row.serviceCost) },
    { key: 'serviceDate', label: 'Date' },
    { key: 'maintenanceStatus', label: 'Status', render: (row) => (
      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${row.maintenanceStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'}`}>
        {row.maintenanceStatus}
      </span>
    ) },
    { key: 'actions', label: 'Actions', render: (row) => (
      row.maintenanceStatus !== 'Completed' && (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleComplete(row.id)} 
          className="rounded-lg border border-emerald-200 dark:border-emerald-700/50 p-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors shadow-sm"
        >
          Mark Complete
        </motion.button>
      )
    ) },
  ], []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <Header title="Maintenance Management" subtitle="Schedule, track, and log vehicle maintenance" />
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Card title="Service Records">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-4">
            <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
              <div className="min-w-[220px] flex-1">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search</span>
                <SearchInput value={search} onChange={setSearch} placeholder="Search vehicle or service" />
              </div>
              <label className="text-sm">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full min-w-[150px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
                  {['All', 'In Progress', 'Completed'].map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 font-medium shadow-md shadow-orange-500/20"
            >
              <Plus size={18} /> Log Maintenance
            </motion.button>
          </div>

          {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">{error}</div> : null}
          {loading ? (
            <div className="flex justify-center items-center h-24">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : null}
          <div className="mt-2">
            <DataTable columns={columns} rows={records} emptyMessage="No maintenance records found." />
          </div>
        </Card>
      </motion.div>

      {isModalOpen ? (
        <Modal title="Log Maintenance" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.submit ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formErrors.submit}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Vehicle ID</span>
                <input value={form.vehicleId} onChange={(event) => setForm((current) => ({ ...current, vehicleId: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.vehicleId ? <p className="mt-1 text-xs text-rose-600">{formErrors.vehicleId}</p> : null}
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Service Type</span>
                <select value={form.serviceType} onChange={(event) => setForm((current) => ({ ...current, serviceType: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  {['Oil Change', 'Tire Replacement', 'Engine Repair', 'Battery Change', 'Inspection'].map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Service Cost ({currencySymbol})</span>
                <input type="number" value={form.serviceCost} onChange={(event) => setForm((current) => ({ ...current, serviceCost: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.serviceCost ? <p className="mt-1 text-xs text-rose-600">{formErrors.serviceCost}</p> : null}
              </label>
              <label className="text-sm md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Notes</span>
                <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" rows={3} />
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancel</button>
              <button type="submit" className="rounded-lg bg-orange-500 text-white px-5 py-2 text-sm font-medium hover:bg-orange-600 shadow-md shadow-orange-500/20 transition">Log Maintenance</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default MaintenanceDashboardPage;

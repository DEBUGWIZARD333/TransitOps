import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import Header from '../../components/common/Header';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import StatusBadge from '../../components/common/StatusBadge';
import { createVehicle, fetchVehicles } from '../../services/fleetService';

const vehicleTypeOptions = ['All', 'Bus', 'Truck', 'Van'];
const statusOptions = ['All', 'Available', 'On Trip', 'In Shop', 'Retired'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const VehicleListPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ vehicleType: 'All', status: 'All' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ registrationNumber: '', vehicleName: '', vehicleType: 'Bus', maxCapacity: '', odometer: '', acquisitionCost: '', status: 'Available' });
  const [formErrors, setFormErrors] = useState({});

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await fetchVehicles({ search, vehicleType: filters.vehicleType === 'All' ? '' : filters.vehicleType, status: filters.status === 'All' ? '' : filters.status });
      setVehicles(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [search, filters.vehicleType, filters.status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.registrationNumber.trim()) nextErrors.registrationNumber = 'Registration number is required';
    if (!form.vehicleName.trim()) nextErrors.vehicleName = 'Vehicle name is required';
    if (!form.vehicleType) nextErrors.vehicleType = 'Vehicle type is required';
    if (!form.status) nextErrors.status = 'Status is required';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createVehicle({ ...form, maxCapacity: Number(form.maxCapacity || 0), odometer: Number(form.odometer || 0), acquisitionCost: Number(form.acquisitionCost || 0) });
      setIsModalOpen(false);
      setForm({ registrationNumber: '', vehicleName: '', vehicleType: 'Bus', maxCapacity: '', odometer: '', acquisitionCost: '', status: 'Available' });
      loadVehicles();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Unable to register vehicle' });
    }
  };

  const columns = useMemo(() => [
    { key: 'registrationNumber', label: 'Registration Number' },
    { key: 'vehicleName', label: 'Vehicle Name/Model' },
    { key: 'vehicleType', label: 'Vehicle Type' },
    { key: 'maxCapacity', label: 'Maximum Capacity' },
    { key: 'odometer', label: 'Odometer' },
    { key: 'acquisitionCost', label: 'Acquisition Cost', render: (row) => `$${Number(row.acquisitionCost).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ], []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <Header title="Vehicle Registry" subtitle="Track fleet assets, utilization, and operational availability" />
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Card title="Fleet Inventory">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-4">
            <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
              <div className="min-w-[220px] flex-1">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search</span>
                <SearchInput value={search} onChange={setSearch} placeholder="Search registration number" />
              </div>
              <FilterBar filters={filters} onChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))} options={[
                { name: 'vehicleType', label: 'Vehicle Type', values: vehicleTypeOptions },
                { name: 'status', label: 'Status', values: statusOptions },
              ]} />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 font-medium shadow-md shadow-indigo-500/20"
            >
              <Plus size={18} /> Add Vehicle
            </motion.button>
          </div>

          {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">{error}</div> : null}
          {loading ? (
            <div className="flex justify-center items-center h-24">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : null}
          <div className="mt-2">
            <DataTable columns={columns} rows={vehicles} emptyMessage="No vehicles found." />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Registration Number must be unique. Retired or in-shop vehicles cannot be dispatched.</p>
        </Card>
      </motion.div>

      {isModalOpen ? (
        <Modal title="Register New Vehicle" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.submit ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formErrors.submit}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Registration Number</span>
                <input value={form.registrationNumber} onChange={(event) => setForm((current) => ({ ...current, registrationNumber: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.registrationNumber ? <p className="mt-1 text-xs text-rose-600">{formErrors.registrationNumber}</p> : null}
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Vehicle Name/Model</span>
                <input value={form.vehicleName} onChange={(event) => setForm((current) => ({ ...current, vehicleName: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.vehicleName ? <p className="mt-1 text-xs text-rose-600">{formErrors.vehicleName}</p> : null}
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Vehicle Type</span>
                <select value={form.vehicleType} onChange={(event) => setForm((current) => ({ ...current, vehicleType: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  {vehicleTypeOptions.filter((option) => option !== 'All').map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Status</span>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  {statusOptions.filter((option) => option !== 'All').map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Maximum Capacity</span>
                <input type="number" value={form.maxCapacity} onChange={(event) => setForm((current) => ({ ...current, maxCapacity: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Odometer</span>
                <input type="number" value={form.odometer} onChange={(event) => setForm((current) => ({ ...current, odometer: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </label>
              <label className="text-sm md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Acquisition Cost</span>
                <input type="number" value={form.acquisitionCost} onChange={(event) => setForm((current) => ({ ...current, acquisitionCost: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancel</button>
              <button type="submit" className="rounded-lg bg-indigo-600 text-white px-5 py-2 text-sm font-medium hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition">Register Vehicle</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default VehicleListPage;

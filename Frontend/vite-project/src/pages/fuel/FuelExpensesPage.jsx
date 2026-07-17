import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import Header from '../../components/common/Header';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import { fetchFuelExpenses, createExpense, fetchExpensesSummary } from '../../services/expenseService';
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

const FuelExpensesPage = () => {
  const { formatMoney, currencySymbol } = useSettings() || {
    formatMoney: (val) => `₦${Number(val).toLocaleString()}`,
    currencySymbol: '₦'
  };
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expenseType, setExpenseType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ expenseType: 'Fuel', amount: '', vehicleId: '', description: '' });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [expensesData, summaryData] = await Promise.all([
        fetchFuelExpenses({ search, type: expenseType === 'All' ? '' : expenseType }),
        fetchExpensesSummary(),
      ]);
      setExpenses(expensesData);
      setSummary(summaryData);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, expenseType]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.expenseType) nextErrors.expenseType = 'Expense type is required';
    if (!form.amount) nextErrors.amount = 'Amount is required';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createExpense({ ...form, amount: Number(form.amount) });
      setIsModalOpen(false);
      setForm({ expenseType: 'Fuel', amount: '', vehicleId: '', description: '' });
      loadData();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Unable to create expense' });
    }
  };

  const columns = useMemo(() => [
    { key: 'expenseType', label: 'Type' },
    { key: 'vehicleId', label: 'Vehicle' },
    { key: 'amount', label: 'Amount', render: (row) => formatMoney(row.amount) },
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
  ], []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <Header title="Fuel & Expenses" subtitle="Track operational costs and fuel consumption" />
      
      {summary ? (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-3">
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-lg shadow-indigo-500/20">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
            <p className="text-xs font-bold tracking-widest opacity-80 uppercase mb-2">Total Expenses</p>
            <p className="text-3xl font-black">{formatMoney(summary.totalExpenses)}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg shadow-emerald-500/20">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
            <p className="text-xs font-bold tracking-widest opacity-80 uppercase mb-2">Expense Records</p>
            <p className="text-3xl font-black">{summary.recordCount}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-5 text-white shadow-lg shadow-purple-500/20">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
            <p className="text-xs font-bold tracking-widest opacity-80 uppercase mb-2">Breakdown</p>
            <div className="space-y-1 mt-1 text-sm font-medium">
              {Object.entries(summary.byType || {}).map(([type, amount]) => (
                <div key={type} className="flex justify-between items-center border-b border-white/20 pb-1 last:border-0 last:pb-0">
                  <span>{type}</span>
                  <span>{formatMoney(amount)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      <Card title="Expense Log">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-4">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
            <div className="min-w-[220px] flex-1">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search</span>
              <SearchInput value={search} onChange={setSearch} placeholder="Search vehicle or description" />
            </div>
            <label className="text-sm">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</span>
              <select value={expenseType} onChange={(event) => setExpenseType(event.target.value)} className="w-full min-w-[150px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
                {['All', 'Fuel', 'Maintenance', 'Toll', 'Other'].map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 font-medium shadow-md shadow-indigo-500/20"
          >
            <Plus size={18} /> Add Expense
          </motion.button>
        </div>

        {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        {loading ? (
          <div className="flex justify-center items-center h-24">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : null}
        <div className="mt-2">
          <DataTable columns={columns} rows={expenses} emptyMessage="No expenses found." />
        </div>
      </Card>

      {isModalOpen ? (
        <Modal title="Record Expense" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.submit ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formErrors.submit}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Expense Type</span>
                <select value={form.expenseType} onChange={(event) => setForm((current) => ({ ...current, expenseType: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  {['Fuel', 'Maintenance', 'Toll', 'Other'].map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                {formErrors.expenseType ? <p className="mt-1 text-xs text-rose-600">{formErrors.expenseType}</p> : null}
              </label>
              <label className="text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Amount ({currencySymbol})</span>
                <input type="number" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                {formErrors.amount ? <p className="mt-1 text-xs text-rose-600">{formErrors.amount}</p> : null}
              </label>
              <label className="text-sm md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Vehicle ID</span>
                <input value={form.vehicleId} onChange={(event) => setForm((current) => ({ ...current, vehicleId: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </label>
              <label className="text-sm md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-300">Description</span>
                <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" rows={3} />
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancel</button>
              <button type="submit" className="rounded-lg bg-indigo-600 text-white px-5 py-2 text-sm font-medium hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition">Record Expense</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default FuelExpensesPage;

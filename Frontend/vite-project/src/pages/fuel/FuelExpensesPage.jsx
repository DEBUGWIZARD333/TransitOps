import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import Header from '../../components/common/Header';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import { fetchFuelExpenses, createExpense, fetchExpensesSummary } from '../../services/expenseService';

const FuelExpensesPage = () => {
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
    { key: 'amount', label: 'Amount', render: (row) => `₦${Number(row.amount).toLocaleString()}` },
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
  ], []);

  return (
    <div className="space-y-6">
      <Header title="Fuel & Expenses" subtitle="Track operational costs and fuel consumption" />
      
      {summary ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Total Expenses</p>
              <p className="text-3xl font-semibold text-slate-900">₦{Number(summary.totalExpenses).toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Expense Records</p>
              <p className="text-3xl font-semibold text-slate-900">{summary.recordCount}</p>
            </div>
          </Card>
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Breakdown</p>
              <div className="space-y-1">
                {Object.entries(summary.byType || {}).map(([type, amount]) => (
                  <p key={type} className="text-sm">{type}: ₦{Number(amount).toLocaleString()}</p>
                ))}
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      <Card title="Expense Log">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
            <div className="min-w-[220px] flex-1">
              <SearchInput value={search} onChange={setSearch} placeholder="Search vehicle or description" />
            </div>
            <label className="text-sm text-slate-600">
              <span className="mb-2 block font-medium text-slate-700">Type</span>
              <select value={expenseType} onChange={(event) => setExpenseType(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
                {['All', 'Fuel', 'Maintenance', 'Toll', 'Other'].map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-full">
            <Plus size={16} /> Add Expense
          </Button>
        </div>

        {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        {loading ? <div className="mt-4 text-sm text-slate-500">Loading expenses...</div> : null}
        <div className="mt-6">
          <DataTable columns={columns} rows={expenses} emptyMessage="No expenses found." />
        </div>
      </Card>

      {isModalOpen ? (
        <Modal title="Record Expense" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.submit ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formErrors.submit}</div> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Expense Type</span>
                <select value={form.expenseType} onChange={(event) => setForm((current) => ({ ...current, expenseType: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none">
                  {['Fuel', 'Maintenance', 'Toll', 'Other'].map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                {formErrors.expenseType ? <p className="mt-1 text-xs text-rose-600">{formErrors.expenseType}</p> : null}
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Amount (₦)</span>
                <input type="number" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.amount ? <p className="mt-1 text-xs text-rose-600">{formErrors.amount}</p> : null}
              </label>
              <label className="text-sm text-slate-600 md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700">Vehicle ID</span>
                <input value={form.vehicleId} onChange={(event) => setForm((current) => ({ ...current, vehicleId: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
              </label>
              <label className="text-sm text-slate-600 md:col-span-2">
                <span className="mb-2 block font-medium text-slate-700">Description</span>
                <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
              <Button type="submit">Record Expense</Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default FuelExpensesPage;

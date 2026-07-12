import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Header from '../../components/common/Header';
import { fetchRolePermissions, fetchSettings, updateSettings } from '../../services/settingsService';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [settingsData, permissionsData] = await Promise.all([
          fetchSettings(),
          fetchRolePermissions(),
        ]);
        setSettings(settingsData);
        setPermissions(permissionsData);
        setForm(settingsData);
        setError('');
      } catch (err) {
        setError(err.message || 'Unable to load settings');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(form);
      setError('');
      alert('Settings saved successfully');
    } catch (err) {
      setError(err.message || 'Unable to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <Header title="Settings" subtitle="System configuration and access control" />

      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      {/* General Settings */}
      <Card title="General Settings">
        <div className="space-y-4">
          <label className="block text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Company Name</span>
            <input value={form.companyName || ''} onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
          </label>
          <label className="block text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Timezone</span>
            <select value={form.timezone || ''} onChange={(event) => setForm((current) => ({ ...current, timezone: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none">
              {['Africa/Lagos', 'UTC', 'GMT'].map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </label>
          <label className="block text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Date Format</span>
            <select value={form.dateFormat || ''} onChange={(event) => setForm((current) => ({ ...current, dateFormat: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none">
              {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map((fmt) => <option key={fmt} value={fmt}>{fmt}</option>)}
            </select>
          </label>
          <label className="block text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Currency</span>
            <input value={form.currency || ''} onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
          </label>
          <button onClick={handleSave} disabled={isSaving} className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </Card>

      {/* Role Permissions Matrix */}
      {permissions ? (
        <Card title="Role Permissions Matrix">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Module</th>
                  <th className="px-4 py-3 font-medium">Admin</th>
                  <th className="px-4 py-3 font-medium">Fleet Manager</th>
                  <th className="px-4 py-3 font-medium">Dispatcher</th>
                  <th className="px-4 py-3 font-medium">Safety Officer</th>
                  <th className="px-4 py-3 font-medium">Financial Analyst</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {['dashboard', 'fleet', 'drivers', 'trips', 'maintenance', 'fuelExpenses', 'analytics'].map((module) => (
                  <tr key={module} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{module.replace(/([A-Z])/g, ' $1').trim()}</td>
                    <td className="px-4 py-3 text-center">{permissions.admin?.[module] ? '✓' : '—'}</td>
                    <td className="px-4 py-3 text-center">{permissions.fleet_manager?.[module] ? '✓' : '—'}</td>
                    <td className="px-4 py-3 text-center">{permissions.dispatcher?.[module] ? '✓' : '—'}</td>
                    <td className="px-4 py-3 text-center">{permissions.safety_officer?.[module] ? '✓' : '—'}</td>
                    <td className="px-4 py-3 text-center">{permissions.financial_analyst?.[module] ? '✓' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default SettingsPage;

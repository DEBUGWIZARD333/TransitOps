import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, PencilLine, ShieldAlert, Trash2, UserPlus } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Header from '../../components/common/Header';
import { createAdminUser, disableAdminUser, fetchAdminUsers, resetAdminUserPassword } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { canPerformAction } from '../../config/rolePermissions';

const roleOptions = ['Admin', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];

const AdminPage = () => {
  const { user } = useAuth();
  const canCreateUsers = canPerformAction(user?.role, 'create');
  const canEditUsers = canPerformAction(user?.role, 'edit');
  const canDeleteUsers = canPerformAction(user?.role, 'delete');
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: roleOptions[0] });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const [confirmUserId, setConfirmUserId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchAdminUsers(roleFilter);
      setUsers(data);
    };

    loadUsers();
  }, [roleFilter]);

  const filteredUsers = useMemo(() => users.filter((entry) => !roleFilter || entry.role === roleFilter), [users, roleFilter]);

  const validateForm = () => {
    const errors = {};
    if (!form.username.trim()) errors.username = 'Username is required.';
    if (!form.password || form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
    return errors;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    try {
      const createdUser = await createAdminUser({
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      });
      setStatusMessage(`User created successfully for ${createdUser.name || form.username}.`);
      setTemporaryPassword(createdUser.temporaryPassword || form.password);
      setPendingUser(createdUser);
      setForm({ username: '', password: '', role: roleOptions[0] });
      setIsModalOpen(false);
      const data = await fetchAdminUsers(roleFilter);
      setUsers(data);
    } catch (error) {
      setFormErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisable = async (userId) => {
    await disableAdminUser(userId);
    const data = await fetchAdminUsers(roleFilter);
    setUsers(data);
    setConfirmUserId(null);
    setStatusMessage('User disabled successfully.');
  };

  const handleResetPassword = async (userId) => {
    const generatedPassword = `Temp@${Math.floor(1000 + Math.random() * 9000)}`;
    await resetAdminUserPassword(userId, generatedPassword);
    setTemporaryPassword(generatedPassword);
    setPendingUser({ id: userId, name: 'Selected user' });
    setStatusMessage('Temporary password generated.');
  };

  return (
    <div className="space-y-6">
      <Header title="Admin Console" subtitle="Manage users, access, and account security" />

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">User Directory</h3>
            <p className="text-sm text-slate-500">Only administrators can manage users from this workspace.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="text-sm text-slate-600">
              <span className="mb-2 block font-medium text-slate-700">Filter by role</span>
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
                <option value="">All roles</option>
                {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </label>
            {canCreateUsers ? (
              <Button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 rounded-full">
                <UserPlus size={16} /> Register new user
              </Button>
            ) : null}
          </div>
        </div>

        {statusMessage ? <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{statusMessage}</div> : null}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{entry.name || entry.username}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.email || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.role}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${entry.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{entry.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {canEditUsers ? (
                        <button className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100" title="Edit user">
                          <PencilLine size={15} />
                        </button>
                      ) : null}
                      {canDeleteUsers ? (
                        <button onClick={() => setConfirmUserId(entry.id)} className="rounded-lg border border-slate-200 p-2 text-amber-600 transition hover:bg-amber-50" title="Disable user">
                          <ShieldAlert size={15} />
                        </button>
                      ) : null}
                      <button onClick={() => handleResetPassword(entry.id)} className="rounded-lg border border-slate-200 p-2 text-sky-600 transition hover:bg-sky-50" title="Reset password">
                        <KeyRound size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/45 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Register new user</h3>
                <p className="text-sm text-slate-500">Create a new workspace account.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-sm text-slate-500">Close</button>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              {formErrors.form ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formErrors.form}</div> : null}
              <label className="block text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Username</span>
                <input value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.username ? <p className="mt-1 text-xs text-rose-600">{formErrors.username}</p> : null}
              </label>
              <label className="block text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Password</span>
                <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none" />
                {formErrors.password ? <p className="mt-1 text-xs text-rose-600">{formErrors.password}</p> : null}
              </label>
              <label className="block text-sm text-slate-600">
                <span className="mb-2 block font-medium text-slate-700">Role</span>
                <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none">
                  {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create user'}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {confirmUserId ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <ShieldAlert size={20} />
              <h3 className="text-lg font-semibold text-slate-900">Disable this user?</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">This action will disable the selected account and prevent sign-in until re-enabled.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setConfirmUserId(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">Cancel</button>
              <button onClick={() => handleDisable(confirmUserId)} className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white">Confirm disable</button>
            </div>
          </div>
        </div>
      ) : null}

      {temporaryPassword ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-sky-600">
              <CheckCircle2 size={20} />
              <h3 className="text-lg font-semibold text-slate-900">Temporary password generated</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">Share this password with the user once. It should be changed on first sign-in.</p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">{temporaryPassword}</div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => { setTemporaryPassword(''); setPendingUser(null); }} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminPage;

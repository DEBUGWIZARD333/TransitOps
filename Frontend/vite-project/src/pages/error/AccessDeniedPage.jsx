import { ShieldAlert } from 'lucide-react';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleLabel } from '../../config/rolePermissions';

const AccessDeniedPage = ({ requestedPath }) => {
  const { user } = useAuth();
  const roleLabel = getRoleLabel(user?.role);

  return (
    <div className="space-y-6">
      <Header title="Access Denied" subtitle="This area is not available for your current role." />
      <Card title="Permission required">
        <div className="flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} />
            <p className="font-semibold">You do not currently have access to this section.</p>
          </div>
          <p className="text-sm">Your active role is <span className="font-semibold">{roleLabel}</span>. Please use the navigation menu to continue within your permitted modules.</p>
          {requestedPath ? <p className="text-sm text-rose-600">Requested path: {requestedPath}</p> : null}
        </div>
      </Card>
    </div>
  );
};

export default AccessDeniedPage;

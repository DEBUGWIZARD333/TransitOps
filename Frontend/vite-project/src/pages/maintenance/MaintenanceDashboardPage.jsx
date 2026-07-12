import Card from '../../components/common/Card';
import Header from '../../components/common/Header';

const MaintenanceDashboardPage = () => (
  <div className="space-y-6">
    <Header title="Maintenance" subtitle="Preventive and corrective maintenance overview" />
    <Card title="Service Queue">Upcoming inspections and repairs will appear here.</Card>
  </div>
);

export default MaintenanceDashboardPage;

import Card from '../../components/common/Card';
import Header from '../../components/common/Header';

const DriverListPage = () => (
  <div className="space-y-6">
    <Header title="Driver Directory" subtitle="Driver roster and availability" />
    <Card title="Driver Summary">Driver records and assignment status will appear here.</Card>
  </div>
);

export default DriverListPage;

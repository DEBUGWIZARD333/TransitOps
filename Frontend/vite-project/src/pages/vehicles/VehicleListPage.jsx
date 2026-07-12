import Card from '../../components/common/Card';
import Header from '../../components/common/Header';

const VehicleListPage = () => (
  <div className="space-y-6">
    <Header title="Vehicle Fleet" subtitle="Vehicle management overview" />
    <Card title="Fleet Summary">Vehicle list and operational status will appear here.</Card>
  </div>
);

export default VehicleListPage;

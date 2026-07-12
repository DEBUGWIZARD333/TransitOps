import Card from '../../components/common/Card';
import Header from '../../components/common/Header';

const TripListPage = () => (
  <div className="space-y-6">
    <Header title="Trips" subtitle="Trip planning and progress overview" />
    <Card title="Trip Summary">Current and upcoming trips will appear here.</Card>
  </div>
);

export default TripListPage;

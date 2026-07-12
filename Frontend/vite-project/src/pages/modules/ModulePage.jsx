import Card from '../../components/common/Card';
import Header from '../../components/common/Header';

const ModulePage = ({ title, subtitle, summary }) => (
  <div className="space-y-6">
    <Header title={title} subtitle={subtitle} />
    <Card title={title}>{summary}</Card>
  </div>
);

export default ModulePage;

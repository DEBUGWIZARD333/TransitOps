import Button from '../../components/common/Button';
import Form from '../../components/common/Form';
import Input from '../../components/common/Input';

const ForgotPasswordPage = () => (
  <Form title="Reset your password">
    <p className="text-sm text-slate-600">We will email a secure reset link to your inbox.</p>
    <Input label="Email" type="email" placeholder="ops@transitops.com" />
    <Button className="w-full">Send reset link</Button>
  </Form>
);

export default ForgotPasswordPage;

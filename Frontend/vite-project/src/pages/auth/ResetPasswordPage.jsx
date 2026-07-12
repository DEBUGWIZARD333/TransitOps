import Button from '../../components/common/Button';
import Form from '../../components/common/Form';
import Input from '../../components/common/Input';

const ResetPasswordPage = () => (
  <Form title="Create a new password">
    <Input label="New password" type="password" placeholder="New password" />
    <Input label="Confirm password" type="password" placeholder="Confirm password" />
    <Button className="w-full">Update password</Button>
  </Form>
);

export default ResetPasswordPage;

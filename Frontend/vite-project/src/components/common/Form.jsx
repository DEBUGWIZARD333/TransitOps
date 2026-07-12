const Form = ({ title, children }) => (
  <div>
    <h2 className="mb-6 text-2xl font-semibold text-slate-900">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

export default Form;

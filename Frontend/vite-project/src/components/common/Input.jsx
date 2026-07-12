const Input = ({ label, ...props }) => (
  <label className="block text-sm text-slate-600">
    {label ? <span className="mb-2 block font-medium text-slate-700">{label}</span> : null}
    <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400" {...props} />
  </label>
);

export default Input;

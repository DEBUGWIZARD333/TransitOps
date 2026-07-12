const Button = ({ children, className = '', ...props }) => (
  <button className={`rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()} {...props}>
    {children}
  </button>
);

export default Button;

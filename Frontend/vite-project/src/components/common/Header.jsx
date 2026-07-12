const Header = ({ title, subtitle }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
    {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
  </div>
);

export default Header;

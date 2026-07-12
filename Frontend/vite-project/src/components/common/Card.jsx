const Card = ({ title, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    {title ? <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3> : null}
    {children}
  </section>
);

export default Card;

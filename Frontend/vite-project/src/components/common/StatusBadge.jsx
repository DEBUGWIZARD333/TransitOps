const statusStyles = {
  Available: 'bg-emerald-100 text-emerald-700',
  'On Trip': 'bg-sky-100 text-sky-700',
  'In Shop': 'bg-amber-100 text-amber-700',
  Retired: 'bg-rose-100 text-rose-700',
  'Off Duty': 'bg-slate-100 text-slate-700',
  Suspended: 'bg-rose-100 text-rose-700',
};

const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}>
    {status}
  </span>
);

export default StatusBadge;

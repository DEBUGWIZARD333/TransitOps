const FilterBar = ({ filters, onChange, options }) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-end">
    {options.map((option) => (
      <label key={option.name} className="text-sm text-slate-600">
        <span className="mb-2 block font-medium text-slate-700">{option.label}</span>
        <select
          value={filters[option.name] || ''}
          onChange={(event) => onChange(option.name, event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none"
        >
          {option.values.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>
    ))}
  </div>
);

export default FilterBar;

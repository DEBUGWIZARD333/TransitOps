import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder }) => (
  <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
    <Search size={16} />
    <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent outline-none" placeholder={placeholder || 'Search'} />
  </label>
);

export default SearchInput;

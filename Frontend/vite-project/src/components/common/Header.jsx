const Header = ({ title, subtitle }) => (
  <div className="glass-panel mb-6 border-l-4 border-l-indigo-500 p-6 flex flex-col justify-center">
    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-600 dark:from-slate-100 dark:to-indigo-400">
      {title}
    </h2>
    {subtitle ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p> : null}
  </div>
);

export default Header;

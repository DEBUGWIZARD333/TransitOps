const DataTable = ({ columns, rows, emptyMessage }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.length ? rows.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={`${row.id || rowIndex}-${column.key}`} className="px-4 py-3 text-slate-600">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td className="px-4 py-6 text-center text-slate-500" colSpan={columns.length}>
                {emptyMessage || 'No records found.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataTable;

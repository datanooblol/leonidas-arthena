interface DataTableProps {
  columns: string[];
  data: any[][];
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border border-border rounded-lg">
      <thead className="bg-bg-element">
        <tr>
          {columns.map((col, i) => (
            <th key={i} className="px-4 py-2 text-left border-b border-border">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-bg-element/50">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 border-b border-border">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
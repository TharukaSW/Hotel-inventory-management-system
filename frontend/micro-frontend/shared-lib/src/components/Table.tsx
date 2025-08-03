
import { TableColumn } from '../types';

interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
  className = ''
}: TableProps<T>) => {
  if (loading) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loading...
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            <div className="px-6 py-4 text-center text-sm text-gray-500">
              Loading data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''} 
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 
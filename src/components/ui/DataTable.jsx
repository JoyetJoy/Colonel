import React from "react";

export function DataTable({
  columns = [],
  data = [],
  pagination = true,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange = () => { },
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="text-left text-xs text-muted-foreground px-4 py-3 whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr
                  key={item.id || rowIndex}
                  className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                >
                  {columns.map((col, colIndex) => {
                    let cellContent = null;
                    if (typeof col.accessor === 'function') {
                      cellContent = col.accessor(item);
                    } else if (col.accessor) {
                      cellContent = item[col.accessor];
                    } else if (col.render) {
                      const val = col.key ? item[col.key] : item;
                      cellContent = col.render(val, item);
                    } else if (col.key) {
                      cellContent = item[col.key];
                    }

                    return (
                      <td
                        key={colIndex}
                        className={`px-4 py-3 text-sm ${col.className || "text-foreground"}`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-white rounded-b-xl">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="text-gray-900">{data.length}</span> of <span className="text-gray-900">{totalItems}</span> entries
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(p)}
                className={`min-w-[28px] h-7 px-1 rounded text-xs font-medium transition-colors cursor-pointer ${p === currentPage
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

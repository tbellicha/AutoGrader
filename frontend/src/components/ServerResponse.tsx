import React from 'react';
import { useTable, Column } from 'react-table';

// Define the expected shape of the JSON data
interface JsonResponse {
  name: string;
  case: string;
  result: boolean;
}

function ServerResponse({ response }: { response: JsonResponse[] }) {
  // Memoize the data to avoid unnecessary re-renders
  const data = React.useMemo(() => response, [response]);

  // Define the table columns
  const columns: Column<JsonResponse>[] = React.useMemo(
    () => [
      {
        Header: 'Test Name', // Header of the column
        accessor: 'name', // Property in JSON data to display
      },
      {
        Header: 'Test Case',
        accessor: 'case',
      },
      {
        Header: 'Result',
        accessor: 'result', // The 'result' property in JSON data
        Cell: ({ value }) => (value ? 'Passing' : 'Failed'), // Custom rendering for the 'Result' column
      },
    ],
    []
  );

    // Create the table instance using react-table's useTable hook
    const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <div>
      <h1>Server Response</h1>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ServerResponse;

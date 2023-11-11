import React from 'react';
import { useTable, Column } from 'react-table';

// Define the expected shape of the JSON data for tests
interface TestResult {
  name: string;
  case: string;
  result: boolean;
  points: number;
}

// Define the expected shape of the JSON data for metrics
interface MetricsData {
  tests: TestResult[];
  homeworkTotal: number;
  studentsTotal: number;
  studentPercentage: string;
  elapsedTime: string;
  peakMem: string;
}

function ServerResponse({ response }: { response: MetricsData }) {
  // Extract the "tests" array from the response
  const testsData = response.tests;

  // Define columns for the tests table
  const testColumns: Column<TestResult>[] = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Case',
        accessor: 'case',
      },
      {
        Header: 'Result',
        accessor: 'result',
        Cell: ({ value }) => (value ? 'Passing' : 'Failed'),
      },
      {
        Header: 'Points',
        accessor: 'points',
      },
    ],
    []
  );

  // Create the table instance for the tests
  const {
    getTableProps: getTestsTableProps,
    getTableBodyProps: getTestsTableBodyProps,
    headerGroups: testsHeaderGroups,
    rows: testsRows,
    prepareRow: prepareTestsRow,
  } = useTable({
    columns: testColumns,
    data: testsData,
  });

  return (
    <div>
      <h1>Server Response</h1>
      <div>
        <h2>Test Metrics</h2>
        <table {...getTestsTableProps()} className="table">
          <thead>
            {testsHeaderGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTestsTableBodyProps()}>
            {testsRows.map((row) => {
              prepareTestsRow(row);
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
      <div>
        <h2>Test Metrics Summary</h2>
        <p>Homework Total: {response.homeworkTotal}</p>
        <p>Students Total: {response.studentsTotal}</p>
        <p>Student Percentage: {response.studentPercentage}</p>
        <p>Elapsed Time: {response.elapsedTime}</p>
        <p>Peak Memory Usage: {response.peakMem}</p>
      </div>
    </div>
  );
}

export default ServerResponse;

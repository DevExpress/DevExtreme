import React from 'react';
import RowTemplate from './RowTemplate.js';

const years = ['2010', '2011', '2012'];
function App() {
  return (
    <>
      <div className="long-title">
        <h3>Monthly Prices of Aluminium, Nickel and Copper</h3>
      </div>
      <div id="chart-demo">
        <table
          className="demo-table"
          style={{ border: 1 }}
        >
          <tbody>
            <tr>
              <th>
                <div className="dx-screen-reader-only">Year</div>
              </th>
              <th>Aluminium (USD/ton)</th>
              <th>Nickel (USD/ton)</th>
              <th>Copper (USD/ton)</th>
            </tr>
            {years.map((year, index) => (
              <RowTemplate
                key={index}
                year={year}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default App;

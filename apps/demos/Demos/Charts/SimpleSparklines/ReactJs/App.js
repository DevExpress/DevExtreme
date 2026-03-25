import React from 'react';
import RowTemplate from './RowTemplate.js';

const years = ['2021', '2022', '2023'];
function App() {
  return (
    <>
      <div className="long-title">
        <h3>Monthly Prices of Oil, Gold and Silver</h3>
      </div>
      <div id="chart-demo">
        <table className="demo-table">
          <tbody>
            <tr>
              <th>
                <div className="dx-screen-reader-only">Year</div>
              </th>
              <th>Oil (USD/barrel)</th>
              <th>Gold (USD/troy ounce)</th>
              <th>Silver (USD/troy ounce)</th>
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

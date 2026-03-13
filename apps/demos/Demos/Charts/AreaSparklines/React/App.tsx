import React from 'react';
import RowTemplate from './RowTemplate.tsx';

const years = ['2021', '2022', '2023'];

function App() {
  return (
    <>
      <div className="long-title"><h3>Monthly Prices of Copper, Nickel and Palladium</h3></div>
      <div id="chart-demo">
        <table className="demo-table" style={{ border: 1 }}>
          <tbody>
            <tr>
              <th><div className="dx-screen-reader-only">Year</div></th>
              <th>Copper (USD/ton)</th>
              <th>Nickel (USD/ton)</th>
              <th>Palladium (USD/troy ounce)</th>
            </tr>
            {years.map((year, index) => (
              <RowTemplate key={index} year={year} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;

import React from 'react';

import RowTemplate from './RowTemplate.js';

const years = ['2010', '2011', '2012'];

export default function App() {
  return (
    <React.Fragment>
      <div className="long-title"><h3>Monthly Prices of Copper, Nickel and Palladium</h3></div>
      <div id="chart-demo">
        <table
          className="demo-table"
          border="1"
        >
          <tbody>
            <tr>
              <th />
              <th>Copper (USD/ton)</th>
              <th>Nickel (USD/ton)</th>
              <th>Palladium (USD/troy ounce)</th>
            </tr>
            {
              years.map((year, index) => <RowTemplate key={index} year={year} />)
            }
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

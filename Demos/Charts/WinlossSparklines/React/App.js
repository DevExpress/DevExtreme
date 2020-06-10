import React from 'react';

import RowTemplate from './RowTemplate.js';

const years = ['2010', '2011', '2012'];

export default function App() {
  return (
    <React.Fragment>
      <h3 className="long-title">Monthly Prices of Aluminium, Nickel and Copper</h3>
      <div id="chart-demo">
        <table
          className="demo-table"
          border="1"
        >
          <tbody>
            <tr>
              <th />
              <th>Aluminium (USD/ton)</th>
              <th>Nickel (USD/ton)</th>
              <th>Copper (USD/ton)</th>
            </tr>
            {
              years.map((year, index) => {
                return <RowTemplate key={index} year={year} />;
              })
            }
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

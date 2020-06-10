import React from 'react';

import RowTemplate from './RowTemplate.js';

const years = ['2010', '2011', '2012'];

export default function App() {
  return (
    <React.Fragment>
      <h3 className="long-title">Monthly Prices of Oil, Gold and Silver</h3>
      <div id="chart-demo">
        <table className="demo-table">
          <tbody>
            <tr>
              <th />
              <th>Oil (USD/barrel)</th>
              <th>Gold (USD/troy ounce)</th>
              <th>Silver (USD/troy ounce)</th>
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

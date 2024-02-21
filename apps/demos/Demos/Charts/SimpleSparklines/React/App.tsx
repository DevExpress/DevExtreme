import React from 'react';

import RowTemplate from './RowTemplate.tsx';

const years = ['2010', '2011', '2012'];

function App() {
  return (
    <React.Fragment>
      <div className="long-title"><h3>Monthly Prices of Oil, Gold and Silver</h3></div>
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
              years.map((year, index) => <RowTemplate key={index} year={year} />)
            }
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

export default App;

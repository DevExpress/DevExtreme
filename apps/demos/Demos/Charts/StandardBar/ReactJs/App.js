import React from 'react';
import { Chart, Series } from 'devextreme-react/chart';
import { dataSource } from './data.js';

function App() {
  return (
    <Chart
      id="chart"
      dataSource={dataSource}
    >
      <Series
        valueField="oranges"
        argumentField="day"
        name="My oranges"
        type="bar"
        color="#ffaa66"
      />
    </Chart>
  );
}
export default App;

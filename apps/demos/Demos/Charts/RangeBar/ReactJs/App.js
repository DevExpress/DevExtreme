import React from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  ArgumentAxis,
  ValueAxis,
  Label,
  Export,
  Legend,
  Tooltip,
} from 'devextreme-react/chart';
import { oilPrices } from './data.js';

function App() {
  return (
    <Chart
      id="chart"
      dataSource={oilPrices}
      palette="Violet"
      title="Crude Oil Prices in 2005"
    >
      <Tooltip enabled={true}></Tooltip>
      <CommonSeriesSettings
        argumentField="date"
        type="rangebar"
        minBarSize={2}
      />
      <Series
        rangeValue1Field="aVal1"
        rangeValue2Field="aVal2"
        name="ANS West Coast"
      />
      <Series
        rangeValue1Field="tVal1"
        rangeValue2Field="tVal2"
        name="West Texas Intermediate"
      />

      <ArgumentAxis>
        <Label format="month" />
      </ArgumentAxis>
      <ValueAxis title="$ per barrel" />

      <Export enabled={true} />
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
      />
    </Chart>
  );
}
export default App;

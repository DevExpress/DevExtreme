import React from 'react';
import RangeSelector, {
  Chart,
  Margin,
  MinorTickInterval,
  Scale,
  Series,
  TickInterval,
  ValueAxis,
} from 'devextreme-react/range-selector';
import { dataSource } from './data.js';

const range = [new Date(2024, 11, 25), new Date(2025, 0, 1)];
const App = () => (
  <RangeSelector
    id="range-selector"
    title="Select a Range in the Costs and Revenues History"
    dataSource={dataSource}
    defaultValue={range}
  >
    <Margin top={50} />
    <Scale>
      <TickInterval days={7} />
      <MinorTickInterval days={1} />
    </Scale>
    <Chart>
      <Series
        argumentField="t"
        valueField="costs"
      />
      <Series
        argumentField="t"
        valueField="income"
      />
      <ValueAxis min={0} />
    </Chart>
  </RangeSelector>
);
export default App;

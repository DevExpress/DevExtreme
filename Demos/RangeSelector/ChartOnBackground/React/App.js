import React from 'react';
import RangeSelector, { Margin, Scale, TickInterval, MinorTickInterval, Chart, Series, ValueAxis } from 'devextreme-react/range-selector';
import { dataSource } from './data.js';

const range = [new Date(2011, 11, 25), new Date(2012, 0, 1)];

function App() {
  return (
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
        <Series argumentField="t" valueField="costs" />
        <Series argumentField="t" valueField="income" />
        <ValueAxis min={0} />
      </Chart>
    </RangeSelector>
  );
}

export default App;

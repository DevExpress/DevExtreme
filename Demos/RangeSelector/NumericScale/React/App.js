import React from 'react';
import RangeSelector, { Margin, Chart, CommonSeriesSettings, Series, Scale } from 'devextreme-react/range-selector';
import { dataSource } from './data.js';

function App() {
  return (
    <RangeSelector
      id="range-selector"
      title="Select a Product Weight"
      dataSource={dataSource}
      defaultValue={['1', '2']}
    >
      <Margin top={50} />
      <Chart>
        <CommonSeriesSettings type="spline" argumentField="weight" />
        <Series valueField="appleCost" color="#00ff00" />
        <Series valueField="orangeCost" color="#ffa500" />
      </Chart>
      <Scale valueType="numeric" />
    </RangeSelector>
  );
}

export default App;

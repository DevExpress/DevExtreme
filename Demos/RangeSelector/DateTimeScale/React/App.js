import React from 'react';
import RangeSelector, {
  Margin, Chart, CommonSeriesSettings, Series, Scale, TickInterval, MinorTickInterval, SliderMarker,
} from 'devextreme-react/range-selector';
import { dataSource } from './data.js';

const defaultValue = ['2013/03/01', '2013/03/07'];

const App = () => (
  <RangeSelector
    id="range-selector"
    dataSource={dataSource}
    title="Select a Month Period"
    defaultValue={defaultValue}
  >
    <Margin top={50} />
    <Chart>
      <CommonSeriesSettings type="steparea" argumentField="date" />
      <Series valueField="dayT" color="yellow" />
      <Series valueField="nightT" />
    </Chart>
    <Scale valueType="datetime">
      <TickInterval days={2} />
      <MinorTickInterval days={1} />
    </Scale>
    <SliderMarker format="day" />
  </RangeSelector>
);

export default App;

import React from 'react';
import RangeSelector, { Margin, Background, Scale, Label, SliderMarker, Chart, Series } from 'devextreme-react/range-selector';
import { dataSource } from './data.js';

function App() {
  return (
    <RangeSelector
      id="range-selector"
      title="Select a Range in the CPU Usage History"
      dataSource={dataSource}
      defaultValue={[0, 5]}
    >
      <Margin left={15} right={15} top={50} />
      <Background color="#808080" />
      <Scale minorTickInterval={0.5} tickInterval={1}>
        <Label customizeText={format} />
      </Scale>
      <SliderMarker visible={false} />
      <Chart topIndent={0.05} bottomIndent={0.05}>
        <Series argumentField="x" valueField="y" color="#ffa500" width={3} type="line" />
      </Chart>
    </RangeSelector>
  );
}

function format({ valueText }) {
  return `${valueText} s`;
}

export default App;

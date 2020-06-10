import React from 'react';
import RangeSelector, { Margin, Chart, CommonSeriesSettings, SeriesTemplate, Scale, Label, Format } from 'devextreme-react/range-selector';
import { dataSource } from './data.js';

function App() {
  return (
    <RangeSelector
      id="range-selector"
      title="Select a Year Period"
      dataSource={dataSource}
    >
      <Margin top={50} />
      <Chart>
        <CommonSeriesSettings argumentField="year" valueField="oil" type="spline" />
        <SeriesTemplate customizeSeries={customizeSeries} nameField="country" />
      </Chart>
      <Scale>
        <Label>
          <Format type="decimal" />
        </Label>
      </Scale>
    </RangeSelector>
  );
}

function customizeSeries(valueFromNameField) {
  return valueFromNameField === 'USA' ? {
    color: 'red'
  } : {};
}

export default App;

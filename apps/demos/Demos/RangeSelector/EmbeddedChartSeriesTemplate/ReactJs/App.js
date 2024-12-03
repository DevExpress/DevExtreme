import React from 'react';
import RangeSelector, {
  Margin,
  Chart,
  CommonSeriesSettings,
  SeriesTemplate,
  Scale,
  Label,
  Format,
} from 'devextreme-react/range-selector';
import { dataSource } from './data.js';

const App = () => {
  const customizeSeries = (valueFromNameField) =>
    (valueFromNameField === 'USA'
      ? {
        color: 'red',
      }
      : {});
  return (
    <RangeSelector
      id="range-selector"
      title="Select a Year Period"
      dataSource={dataSource}
    >
      <Margin top={50} />
      <Chart>
        <CommonSeriesSettings
          argumentField="year"
          valueField="oil"
          type="spline"
        />
        <SeriesTemplate
          customizeSeries={customizeSeries}
          nameField="country"
        />
      </Chart>
      <Scale>
        <Label>
          <Format type="decimal" />
        </Label>
      </Scale>
    </RangeSelector>
  );
};
export default App;

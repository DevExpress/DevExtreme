import React from 'react';
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Label,
  Format,
  Legend,
  Export,
} from 'devextreme-react/chart';
import { grossProductData } from './data.js';

function onPointClick(e) {
  e.target.select();
}
function App() {
  return (
    <Chart
      id="chart"
      title="Gross State Product within the Great Lakes Region (Billions USD)"
      dataSource={grossProductData}
      onPointClick={onPointClick}
    >
      <CommonSeriesSettings
        argumentField="state"
        type="bar"
        hoverMode="allArgumentPoints"
        selectionMode="allArgumentPoints"
      >
        <Label visible={true}>
          <Format
            type="fixedPoint"
            precision={0}
          />
        </Label>
      </CommonSeriesSettings>
      <Series
        argumentField="state"
        valueField="year2024"
        name="2024"
      />
      <Series
        valueField="year2023"
        name="2023"
      />
      <Series
        valueField="year2022"
        name="2022"
      />
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
      ></Legend>
      <Export enabled={true} />
    </Chart>
  );
}
export default App;

import React from 'react';
import {
  Chart, ChartTypes, Series, CommonSeriesSettings, Label, Format, Legend, Export,
} from 'devextreme-react/chart';
import { grossProductData } from './data.ts';

function onPointClick(e: ChartTypes.PointClickEvent) {
  e.target.select();
}

function App() {
  return (
    <Chart id="chart"
      title="Gross State Product within the Great Lakes Region"
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
          <Format type="fixedPoint" precision={0} />
        </Label>
      </CommonSeriesSettings>
      <Series
        argumentField="state"
        valueField="year2018"
        name="2018"
      />
      <Series
        valueField="year2017"
        name="2017"
      />
      <Series
        valueField="year2016"
        name="2016"
      />
      <Legend verticalAlignment="bottom" horizontalAlignment="center"></Legend>
      <Export enabled={true} />
    </Chart>
  );
}

export default App;

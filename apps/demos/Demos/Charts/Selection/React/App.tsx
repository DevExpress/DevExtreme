import React from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  Label,
  Format,
  ValueAxis,
  Legend,
  Export,
} from 'devextreme-react/chart';
import type { ChartTypes } from 'devextreme-react/chart';
import { exportData } from './data.ts';

function onPointClick(e: ChartTypes.PointClickEvent): void {
  e.target.select();
}

function onLegendClick(e: ChartTypes.LegendClickEvent): void {
  if (e.target.isVisible()) {
    e.target.hide();
  } else {
    e.target.show();
  }
}

function App() {
  return (
    <Chart
      id="chart"
      dataSource={exportData}
      rotated={true}
      onPointClick={onPointClick}
      onLegendClick={onLegendClick}
      title="Economy - Export Change"
    >
      <CommonSeriesSettings
        argumentField="country"
        type="bar"
        hoverMode="allArgumentPoints"
        selectionMode="allArgumentPoints"
      >
        <Label visible={true}>
          <Format
            precision={1}
            type="percent"
          />
        </Label>
      </CommonSeriesSettings>
      <Series
        valueField="year2019"
        name="2019 - 2020"
      />
      <Series
        valueField="year2020"
        name="2020 - 2021"
      />
      <ValueAxis>
        <Label>
          <Format
            precision={1}
            type="percent"
          />
        </Label>
      </ValueAxis>
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
      />
      <Export enabled={true} />
    </Chart>
  );
}

export default App;

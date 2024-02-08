import React from 'react';

import {
  Chart, ChartTypes, Series, CommonSeriesSettings, Point, Legend,
} from 'devextreme-react/chart';
import { dataSource } from './data.ts';
import markerTemplate from './MarkerTemplate.tsx';

function onLegendClick(e: ChartTypes.LegendClickEvent) {
  e.target.isVisible() ? e.target.hide() : e.target.show();
}

function App() {
  return (
    <Chart id="chart"
      title="Noisy and Original Signals"
      dataSource={dataSource}
      onLegendClick={onLegendClick}>
      <CommonSeriesSettings
        argumentField="argument">
        <Point visible={false}></Point>
      </CommonSeriesSettings>
      <Series
        valueField="originalValue"
        name="Original Signal"
      />
      <Series
        valueField="value"
        name="Noisy Signal"
      />
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
        markerRender={markerTemplate}
      >
      </Legend>
    </Chart>
  );
}

export default App;

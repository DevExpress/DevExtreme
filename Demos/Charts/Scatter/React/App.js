import React from 'react';

import {
  Chart,
  Series,
  CommonSeriesSettings,
  Point,
  Legend,
  ValueAxis,
  ArgumentAxis,
  Grid,
  MinorGrid,
  CommonPaneSettings,
  Border
} from 'devextreme-react/chart';
import { generateDataSource } from './data.js';

const dataSource = generateDataSource();

export default function App() {
  return (
    <Chart id="chart" dataSource={dataSource}>
      <CommonSeriesSettings type="scatter" />
      <Series
        valueField="y1"
        argumentField="x1" />
      <Series
        valueField="y2"
        argumentField="x2"
      >
        <Point symbol="triangleDown" />
      </Series>
      <ArgumentAxis
        tickInterval={5}
      >
        <Grid visible={true} />
        <MinorGrid visible={true} />
      </ArgumentAxis>
      <ValueAxis tickInterval={50} />
      <Legend visible={false} />
      <CommonPaneSettings>
        <Border visible={true} />
      </CommonPaneSettings>
    </Chart>
  );
}

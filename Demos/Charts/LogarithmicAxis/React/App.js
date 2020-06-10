import React from 'react';

import {
  Chart,
  Series,
  Legend,
  ValueAxis,
  Point,
  Border,
  CommonPaneSettings,
  Tooltip,
  ArgumentAxis,
  Grid,
  Label,
  Export
} from 'devextreme-react/chart';
import { dataSource } from './data.js';

export default function App() {
  return (
    <Chart
      id="chart"
      title="Relative Masses of the Heaviest Solar System Objects"
      dataSource={dataSource}
      customizePoint={customizePoint}
    >
      <ArgumentAxis>
        <Label rotationAngle={20} overlappingBehavior="rotate" />
        <Grid visible={true} />
      </ArgumentAxis>
      <CommonPaneSettings>
        <Border visible={true} />
      </CommonPaneSettings>
      <Series
        argumentField="name"
        valueField="mass"
        type="scatter"
      >
        <Point size={20} />
      </Series>
      <Tooltip enabled={true} />
      <ValueAxis type="logarithmic" title="Mass Relative to the Earth" />
      <Legend visible={false} />
      <Export enabled={true} />
    </Chart>
  );
}

function customizePoint({ data }) {
  let color, hoverStyle;
  switch (data.type) {
    case 'Star':
      color = 'red';
      hoverStyle = { border: { color: 'red' } };
      break;
    case 'Satellite':
      color = 'gray';
      hoverStyle = { border: { color: 'gray' } };
  }
  return { color, hoverStyle };
}

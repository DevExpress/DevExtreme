import React from 'react';
import Chart, {
  CommonSeriesSettings,
  ValueAxis,
  Label,
  Legend,
  Series,
  Tooltip,
  Margin,
} from 'devextreme-react/chart';
import { dataSource } from './data.ts';

function customizeTooltip(e: { valueText: number; }) {
  return { text: Math.abs(e.valueText) };
}

function customizeLabel(e: { value: number; }) {
  return `${Math.abs(e.value)}%`;
}

function App() {
  return (
    <Chart
      title="Population Pyramid For Norway 2016"
      dataSource={dataSource}
      id="chart"
      rotated={true}
      barGroupWidth={18}
    >
      <CommonSeriesSettings
        type="stackedbar"
        argumentField="age"
      />
      <Series
        valueField="male"
        name="Male"
        color="#3F7FBF"
      />
      <Series
        valueField="female"
        name="Female"
        color="#F87CCC"
      />
      <Tooltip
        enabled={true}
        customizeTooltip={customizeTooltip}
      />
      <ValueAxis>
        <Label customizeText={customizeLabel} />
      </ValueAxis>
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
      >
        <Margin left={50} />
      </Legend>
    </Chart>
  );
}

export default App;

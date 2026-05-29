import React from 'react';
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Legend,
  Export,
  Tooltip,
  Title,
} from 'devextreme-react/chart';
import type { ChartTypes } from 'devextreme-react/chart';
import service from './data.ts';

const dataSource = service.dataSource();

function customizeTooltip(arg: ChartTypes.StackedPointInfo): Record<string, string> {
  return {
    text: `${arg.percentText} years: ${arg.valueText}`,
  };
}

function App() {
  return (
    <Chart
      id="chart"
      dataSource={dataSource}
    >
      <Title
        text="Energy Consumption in 2024"
        subtitle="(Millions of Tons, Oil Equivalent)"
      />
      <CommonSeriesSettings argumentField="country" type="fullstackedbar" />
      <Series valueField="hydro" name="Hydro-electric" />
      <Series valueField="oil" name="Oil" />
      <Series valueField="gas" name="Natural gas" />
      <Series valueField="coal" name="Coal" />
      <Series valueField="nuclear" name="Nuclear" />

      <Legend verticalAlignment="top"
        horizontalAlignment="center"
        itemTextPosition="right"
      />
      <Export enabled={true} />
      <Tooltip
        enabled={true}
        customizeTooltip={customizeTooltip}
      />
    </Chart>
  );
}

export default App;

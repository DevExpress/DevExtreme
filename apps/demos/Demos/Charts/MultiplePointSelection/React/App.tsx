import React from 'react';
import Chart, {
  CommonSeriesSettings,
  SelectionStyle,
  Hatching,
  Series,
  Legend,
  Export,
} from 'devextreme-react/chart';
import type { ChartTypes } from 'devextreme-react/chart';
import { medalSources, medalStatistics } from './data.ts';

function onPointClick(e: ChartTypes.PointClickEvent): void {
  if (e.target.isSelected()) {
    e.target.clearSelection();
  } else {
    e.target.select();
  }
}

function App() {
  return (
    <Chart
      id="chart"
      dataSource={medalStatistics}
      rotated={true}
      pointSelectionMode="multiple"
      onPointClick={onPointClick}
      title="Olympic Medals in 2024"
    >
      <CommonSeriesSettings
        argumentField="country"
        type="stackedbar"
      >
        <SelectionStyle>
          <Hatching direction="left" />
        </SelectionStyle>
      </CommonSeriesSettings>
      {
        medalSources.map(({ value, name, color }) => <Series
          key={value}
          valueField={value}
          name={name}
          color={color} />)
      }
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center">
      </Legend>
      <Export enabled={true} />
    </Chart>
  );
}

export default App;

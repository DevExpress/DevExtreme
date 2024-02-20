import React from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  CommonAxisSettings,
  ArgumentAxis,
  ValueAxis,
  Label,
  Format,
  Legend,
  Export,
} from 'devextreme-react/chart';
import { versionSources, statisticsData } from './data.ts';

function onSeriesClick({ target: series }) {
  if (series.isSelected()) {
    series.clearSelection();
  } else {
    series.select();
  }
}

function App() {
  return (
    <Chart
      id="chart"
      dataSource={statisticsData}
      seriesSelectionMode="multiple"
      onSeriesClick={onSeriesClick}
      title="Internet Explorer Statistics"
    >
      <CommonSeriesSettings
        argumentField="year"
        type="stackedarea"
      />
      {
        versionSources.map(({ value, name }) => <Series
          key={value}
          valueField={value}
          name={name} />)
      }
      <CommonAxisSettings valueMarginsEnabled={false} />
      <ArgumentAxis type="discrete" />
      <ValueAxis>
        <Label>
          <Format type="percent" />
        </Label>
      </ValueAxis>
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center">
      </Legend>
      <Export enabled={true} />
    </Chart>
  );
}

export default App;

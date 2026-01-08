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
import { versionSources, statisticsData } from './data.js';

function onSeriesClick(e) {
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
      dataSource={statisticsData}
      seriesSelectionMode="multiple"
      onSeriesClick={onSeriesClick}
      title="Internet Explorer Statistics"
    >
      <CommonSeriesSettings
        argumentField="year"
        type="stackedarea"
      />
      {versionSources.map(({ value, name }) => (
        <Series
          key={value}
          valueField={value}
          name={name}
        />
      ))}
      <CommonAxisSettings valueMarginsEnabled={false} />
      <ArgumentAxis type="discrete" />
      <ValueAxis>
        <Label>
          <Format type="percent" />
        </Label>
      </ValueAxis>
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
      ></Legend>
      <Export enabled={true} />
    </Chart>
  );
}
export default App;

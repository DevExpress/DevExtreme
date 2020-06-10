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
  Export
} from 'devextreme-react/chart';
import { versionSources, statisticsData } from './data.js';

class App extends React.Component {

  render() {
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
          versionSources.map(({ value, name }) => {
            return <Series key={value} valueField={value} name={name} />;
          })
        }
        <CommonAxisSettings valueMarginsEnabled={false} />
        <ArgumentAxis type="discrete" />
        <ValueAxis>
          <Label>
            <Format
              precision={2}
              type="percent"
            />
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
}

function onSeriesClick({ target: series }) {
  if (series.isSelected()) {
    series.clearSelection();
  } else {
    series.select();
  }
}

export default App;

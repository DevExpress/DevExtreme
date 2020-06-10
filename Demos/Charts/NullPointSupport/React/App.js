import React from 'react';

import Chart, {
  ArgumentAxis,
  Series,
  CommonSeriesSettings,
  Label,
  Legend,
  Export,
  Point
} from 'devextreme-react/chart';

import { medalsInfo } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        title="France Olympic Medals"
        dataSource={medalsInfo}
        id="chart"
      >
        <Series valueField="gold" name="Gold Medals" color="#ffd700" />
        <Series valueField="silver" name="Silver Medals" color="#c0c0c0" />
        <CommonSeriesSettings
          argumentField="year"
          type="steparea"
        >
          <Point visible={true} />
        </CommonSeriesSettings>
        <ArgumentAxis>
          <Label format="decimal" />
        </ArgumentAxis>
        <Export enabled={true} />
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        />

      </Chart>
    );
  }
}

export default App;

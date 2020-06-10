import React from 'react';

import Chart, {
  ArgumentAxis,
  Series,
  CommonSeriesSettings,
  Label,
  Legend,
  Border,
  Export
} from 'devextreme-react/chart';

import { dataSource } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        title="Australian Medal Count"
        dataSource={dataSource}
        id="chart">
        <Series valueField="bronze" name="Bronze Medals" color="#cd7f32" />
        <Series valueField="silver" name="Silver Medals" color="#c0c0c0" />
        <Series valueField="gold" name="Gold Medals" color="#ffd700" />
        <CommonSeriesSettings
          argumentField="year"
          type="steparea">
          <Border visible={false} />
        </CommonSeriesSettings>
        <ArgumentAxis valueMarginsEnabled={false}>
          <Label format="decimal" />
        </ArgumentAxis>
        <Export enabled={true} />
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center" />
      </Chart>
    );
  }
}

export default App;

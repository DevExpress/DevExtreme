import React from 'react';

import Chart, {
  CommonSeriesSettings,
  ValueAxis,
  Label,
  Legend,
  Series,
  Tooltip
} from 'devextreme-react/chart';

import { dataSource } from './data.js';

class App extends React.Component {

  render() {
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
          customizeTooltip={this.customizeTooltip}
        />
        <ValueAxis>
          <Label customizeText={this.customizeLabel} />
        </ValueAxis>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          margin={{ left: 50 }}
        />

      </Chart>
    );
  }

  customizeTooltip(e) {
    return { text: Math.abs(e.valueText) };
  }

  customizeLabel(e) {
    return `${Math.abs(e.value)}%`;
  }
}

export default App;

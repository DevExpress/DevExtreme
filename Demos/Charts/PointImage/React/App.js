import React from 'react';
import {
  Chart,
  CommonSeriesSettings,
  Series,
  ArgumentAxis,
  Grid,
  Label,
  Format,
  ValueAxis,
  Export,
  Legend,
  Point
} from 'devextreme-react/chart';
import { iceHockeyStatistics } from './data.js';

const exportFormats = ['PNG', 'PDF', 'JPEG', 'GIF', 'SVG'];

class App extends React.Component {

  render() {
    return (
      <Chart
        id="chart"
        dataSource={iceHockeyStatistics}
        title={'Canadian Men’s National Ice Hockey Team\n at the World Championships'}
        customizePoint={this.customizePoint}
      >
        <CommonSeriesSettings
          argumentField="year"
          valueField="place"
          type="spline"
        >
          <Point visible={false} />
        </CommonSeriesSettings>
        <Series color="#888888" />
        <ArgumentAxis
          allowDecimals={false}
          axisDivisionFactor={60}
        >
          <Grid visible={true} />
          <Label>
            <Format type="decimal" />
          </Label>
        </ArgumentAxis>
        <ValueAxis inverted={true}>
          <Grid visible={false} />
          <Label customizeText={this.customizeText} />
        </ValueAxis>
        <Export
          enabled={true}
          formats={exportFormats}
        />
        <Legend visible={false} />
      </Chart>
    );
  }

  customizePoint() {
    if (this.value == 1) {
      return { image: { url: '../../../../images/icon-medal-gold.png', width: 20, height: 20 }, visible: true };
    } else if (this.value == 2) {
      return { image: { url: '../../../../images/icon-medal-silver.png', width: 20, height: 20 }, visible: true };
    } else if (this.value == 3) {
      return { image: { url: '../../../../images/icon-medal-bronse.png', width: 20, height: 20 }, visible: true };
    }
  }

  customizeText() {
    if (this.valueText == 1) {
      return `${this.valueText}st place`;
    } else if (this.valueText == 2) {
      return `${this.valueText}nd place`;
    } else if (this.valueText == 3) {
      return `${this.valueText}rd place`;
    } else {
      return `${this.valueText}th place`;
    }
  }
}

export default App;

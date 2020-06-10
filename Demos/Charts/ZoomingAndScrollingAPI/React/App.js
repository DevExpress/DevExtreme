import React from 'react';
import { zoomingData } from './data.js';

import Chart, {
  Series,
  Legend,
  CommonSeriesSettings,
  Point,
  ArgumentAxis
} from 'devextreme-react/chart';

import RangeSelector, {
  Size,
  Chart as ChartOptions,
  Margin,
  Scale,
  Behavior

}
  from 'devextreme-react/range-selector';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visualRange: { startValue: 10, endValue: 880 }
    };

    this.updateVisualRange = this.updateVisualRange.bind(this);

  }
  updateVisualRange(e) {
    this.setState({ visualRange: e.value });
  }

  render() {
    return (
      <React.Fragment>
        <Chart
          id="zoomedChart"
          palette="Harmony Light"
          dataSource={zoomingData}
        >
          <Series argumentField="arg" valueField="y1" />
          <Series argumentField="arg" valueField="y2" />
          <Series argumentField="arg" valueField="y3" />
          <ArgumentAxis visualRange={this.state.visualRange} />
          <Legend visible={false} />
          <CommonSeriesSettings>
            <Point size={7} />
          </CommonSeriesSettings>
        </Chart>
        <RangeSelector
          dataSource={zoomingData}
          onValueChanged={this.updateVisualRange}
        >
          <Size height={120} />
          <Margin left={10} />
          <Scale minorTickCount={1} startValue={10} endValue={880} />
          <ChartOptions palette="Harmony Light">
            <Behavior callValueChanged="onMoving" />
            <Legend visible={false} />
            <Series argumentField="arg" valueField="y1" />
            <Series argumentField="arg" valueField="y2" />
            <Series argumentField="arg" valueField="y3" />
          </ChartOptions>
        </RangeSelector>
      </React.Fragment>
    );
  }
}

export default App;

import React from 'react';
import Chart, {
  ArgumentAxis,
  Series,
  ZoomAndPan,
  Legend,
  ScrollBar,
} from 'devextreme-react/chart';
import { zoomingData } from './data.js';

const visualRange = { startValue: 300, endValue: 500 };

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        palette="Harmony Light"
        dataSource={zoomingData}>
        <Series argumentField="arg" valueField="y1" />
        <Series argumentField="arg" valueField="y2" />
        <ArgumentAxis defaultVisualRange={visualRange} />
        <ScrollBar visible={true} />
        <ZoomAndPan argumentAxis="both" />
        <Legend visible={false} />
      </Chart>
    );
  }
}

export default App;

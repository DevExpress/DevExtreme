import React from 'react';
import { zoomingData } from './data.js';

import Chart, {
  ArgumentAxis,
  Series,
  ZoomAndPan,
  Legend,
  ScrollBar
} from 'devextreme-react/chart';

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        palette="Harmony Light"
        dataSource={zoomingData}>
        <Series argumentField="arg" valueField="y1" />
        <Series argumentField="arg" valueField="y2" />
        <ArgumentAxis defaultVisualRange={{ startValue: 300, endValue: 500 }} />
        <ScrollBar visible={true} />
        <ZoomAndPan argumentAxis="both" />
        <Legend visible={false} />
      </Chart>
    );
  }
}

export default App;

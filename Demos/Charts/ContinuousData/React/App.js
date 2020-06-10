import React from 'react';
import {
  PolarChart,
  Series,
  ArgumentAxis,
  Export,
  Legend
} from 'devextreme-react/polar-chart';
import { dataSource } from './data.js';

class App extends React.Component {

  render() {
    return (
      <PolarChart
        id="chart"
        dataSource={dataSource}
        title="Rose in Polar Coordinates"
      >
        <Series type="line" />
        <ArgumentAxis
          inverted={true}
          startAngle={90}
          tickInterval={30}
        />
        <Export enabled={true} />
        <Legend visible={false} />
      </PolarChart>
    );
  }
}

export default App;

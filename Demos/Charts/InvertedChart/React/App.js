import React from 'react';
import {
  PolarChart,
  Series,
  ArgumentAxis,
  ValueAxis,
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
        title="Inverted Rose in Polar Coordinates"
      >
        <Series
          type="area"
          name="Function"
        />
        <ArgumentAxis
          inverted={true}
          startAngle={90}
          tickInterval={30}
        />
        <ValueAxis inverted={true} />
        <Export enabled={true} />
        <Legend visible={false} />
      </PolarChart>
    );
  }
}

export default App;

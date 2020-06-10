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
        title="Archimedean Spiral"
      >
        <Series
          type="line"
          name="Function"
          closed={false}
        />
        <ArgumentAxis
          inverted={true}
          startAngle={90}
          tickInterval={45}
          period={360}
        />
        <Export enabled={true} />
        <Legend visible={false} />
      </PolarChart>
    );
  }
}

export default App;

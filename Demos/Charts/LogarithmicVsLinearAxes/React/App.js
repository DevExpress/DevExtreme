import React from 'react';
import { Chart, Pane, Series, CommonAxisSettings, ValueAxis, Tooltip, Crosshair, HorizontalLine, Label, Legend } from 'devextreme-react/chart';
import { dataSource } from './data.js';

const crosshairFormat = {
  type: 'fixedPoint',
  precision: 2
};

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        dataSource={dataSource}
        title="Damped Sine Wave"
      >
        <Pane name="top" />
        <Pane name="bottom" />
        <Series pane="top" />
        <Series pane="bottom" />
        <CommonAxisSettings endOnTick={false} />
        <ValueAxis title="Logarithmic Axis" linearThreshold={-3} type="logarithmic" pane="top" />
        <ValueAxis title="Linear Axis" pane="bottom" />
        <Tooltip enabled={true} format="exponential" />
        <Crosshair enabled={true}>
          <HorizontalLine visible={false} />
          <Label visible={true} format={crosshairFormat} />
        </Crosshair>
        <Legend visible={false} />
      </Chart>
    );
  }
}

export default App;

import React from 'react';
import RangeSelector, { Chart as RsChart, Series as RsSeries, Scale, Label as RsLabel, SliderMarker, Behavior } from 'devextreme-react/range-selector';
import Chart, { ArgumentAxis, Legend, Series, Label, Grid, MinorGrid } from 'devextreme-react/chart';
import { dataSource } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: []
    };
    this.updateRange = this.updateRange.bind(this);
  }
  render() {
    return (
      <React.Fragment>
        <Chart
          id="zoomed-chart"
          dataSource={dataSource}
          resizePanesOnZoom={true}
        >
          <Series />
          <ArgumentAxis
            visualRange={this.state.range}
            valueMarginsEnabled={false}
            minorTickCount={10}
            type="logarithmic"
          >
            <Label format="exponential" />
            <Grid visible={true} />
            <MinorGrid visible={true} />
          </ArgumentAxis>
          <Legend visible={false} />
        </Chart>
        <RangeSelector
          id="range-selector"
          dataSource={dataSource}
          onValueChanged={this.updateRange}
        >
          <RsChart>
            <RsSeries />
          </RsChart>
          <Scale minRange={1} minorTickCount={10} type="logarithmic">
            <RsLabel format="exponential" />
          </Scale>
          <SliderMarker format="exponential" />
          <Behavior snapToTicks={false} callValueChanged="onMoving" />
        </RangeSelector>
      </React.Fragment>
    );
  }

  updateRange(data) {
    this.setState({
      range: data.value
    });
  }
}

export default App;

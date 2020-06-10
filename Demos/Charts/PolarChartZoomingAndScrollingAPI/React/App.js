import React from 'react';
import { dataSource } from './data.js';

import PolarChart, {
  CommonSeriesSettings,
  Series,
  Point,
  ArgumentAxis,
  ValueAxis,
  Export,
  Legend
} from 'devextreme-react/polar-chart';

import RangeSelector, {
  Size,
  Margin,
  Scale,
  MinorTick,
  Behavior
} from 'devextreme-react/range-selector';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visualRange: { startValue: 0, endValue: 8 }
    };

    this.updateVisualRange = this.updateVisualRange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <PolarChart
          id="zoomedChart"
          dataSource={dataSource}
          title="Stochastic Process"
        >
          <CommonSeriesSettings
            argumentField="argument"
            closed={false}
          />
          <Series
            type="scatter"
            name="Test results"
            valueField="value"
          >
            <Point size={8} />
          </Series>
          <Series
            type="line"
            name="Expected average"
            valueField="originalValue"
          >
            <Point visible={false} />
          </Series>
          <ArgumentAxis
            startAngle={90}
            tickInterval={30}
          />
          <ValueAxis visualRange={this.state.visualRange} />
          <Export enabled={true} />
          <Legend
            hoverMode="excludePoints"
            verticalAlignment="top"
            horizontalAlignment="center"
          />
        </PolarChart>
        <RangeSelector
          onValueChanged={this.updateVisualRange}
        >
          <Size height={100} />
          <Margin
            top={10}
            left={60}
            bottom={10}
            right={50}
          />
          <Scale
            startValue={0}
            endValue={8}
            minorTickInterval={0.1}
            tickInterval={1}
          >
            <MinorTick visible={false} />
          </Scale>
          <Behavior callValueChanged="onMoving" />
        </RangeSelector>
      </React.Fragment>
    );
  }

  updateVisualRange(e) {
    this.setState({ visualRange: e.value });
  }
}

export default App;

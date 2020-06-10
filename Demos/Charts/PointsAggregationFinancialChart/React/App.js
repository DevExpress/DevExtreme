import React from 'react';
import { dataSource } from './data.js';

import Chart, {
  Series,
  Aggregation,
  ArgumentAxis,
  Grid,
  Label,
  ValueAxis,
  Margin,
  Legend,
  Tooltip
} from 'devextreme-react/chart';

import RangeSelector, {
  Size,
  Scale,
  Chart as RsChart,
  ValueAxis as RsValueAxis,
  Series as RsSeries,
  Aggregation as RsAggregation,
  Behavior
} from 'devextreme-react/range-selector';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visualRange: {}
    };

    this.updateVisualRange = this.updateVisualRange.bind(this);
  }

  render() {
    return (
      <div id="chart-demo">
        <Chart
          id="zoomedChart"
          dataSource={dataSource}
          title="Google Inc. Stock Prices"
        >
          <Series
            type="candleStick"
            openValueField="Open"
            highValueField="High"
            lowValueField="Low"
            closeValueField="Close"
            argumentField="Date"
          >
            <Aggregation enabled={true} />
          </Series>
          <ArgumentAxis
            visualRange={this.state.visualRange}
            valueMarginsEnabled={false}
            argumentType="datetime"
          >
            <Grid visible={true} />
            <Label visible={false} />
          </ArgumentAxis>
          <ValueAxis valueType="numeric" />
          <Margin right={10} />
          <Legend visible={false} />
          <Tooltip enabled={true} />
        </Chart>
        <RangeSelector
          dataSource={dataSource}
          onValueChanged={this.updateVisualRange}
        >
          <Size height={120} />
          <RsChart>
            <RsValueAxis valueType="numeric" />
            <RsSeries
              type="line"
              valueField="Open"
              argumentField="Date"
            >
              <RsAggregation enabled="true" />
            </RsSeries>
          </RsChart>
          <Scale
            placeholderHeight={20}
            minorTickInterval="day"
            tickInterval="month"
            valueType="datetime"
            aggregationInterval="week"
          />
          <Behavior
            snapToTicks={false}
            callValueChanged="onMoving"
          />
        </RangeSelector>
      </div>
    );
  }

  updateVisualRange(e) {
    this.setState({ visualRange: e.value });
  }
}

export default App;

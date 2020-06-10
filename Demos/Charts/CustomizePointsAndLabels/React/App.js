import React from 'react';

import {
  Chart,
  Series,
  Legend,
  ValueAxis,
  VisualRange,
  Label,
  ConstantLine,
  Export
} from 'devextreme-react/chart';
import { temperaturesData } from './data.js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      highAverage: 77,
      lowAverage: 58
    };
    this.customizeLabel = this.customizeLabel.bind(this);
    this.customizePoint = this.customizePoint.bind(this);
  }

  render() {
    return (
      <Chart
        id="chart"
        title="Daily Temperature in May"
        dataSource={temperaturesData}
        customizePoint={this.customizePoint}
        customizeLabel={this.customizeLabel}
      >
        <Series
          argumentField="day"
          valueField="value"
          type="bar"
          color="#e7d19a"
        />
        <ValueAxis maxValueMargin={0.01}>
          <VisualRange startValue={40} />
          <Label customizeText={this.customizeText} />
          <ConstantLine
            width={2}
            value={this.state.lowAverage}
            color="#8c8cff"
            dashStyle="dash"
          >
            <Label text="Low Average" />
          </ConstantLine>
          <ConstantLine
            width={2}
            value={this.state.highAverage}
            color="#ff7c7c"
            dashStyle="dash"
          >
            <Label text="High Average" />
          </ConstantLine>
        </ValueAxis>
        <Legend visible={false} />
        <Export enabled={true} />
      </Chart>
    );
  }

  customizePoint(arg) {

    if (arg.value > this.state.highAverage) {
      return { color: '#ff7c7c', hoverStyle: { color: '#ff7c7c' } };
    } else if (arg.value < this.state.lowAverage) {
      return { color: '#8c8cff', hoverStyle: { color: '#8c8cff' } };
    }
  }

  customizeLabel(arg) {
    if (arg.value > this.state.highAverage) {
      return {
        visible: true,
        backgroundColor: '#ff7c7c',
        customizeText: function(e) {
          return `${e.valueText }&#176F`;
        }
      };
    }
  }

  customizeText(arg) {
    return `${arg.valueText }&#176F`;
  }
}

export default App;

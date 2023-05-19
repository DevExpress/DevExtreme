import React from 'react';

import Chart, {
  Legend,
  Series,
  Tooltip,
  ValueAxis,
  BreakStyle,
} from 'devextreme-react/chart';

import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';

import { dataSource, lineStyleLabel, maxCountLabel } from './data.js';

const lineStyles = ['waved', 'straight'];
const breaksCount = [1, 2, 3, 4];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoBreaksEnabledValue: true,
      breaksCountValue: 3,
      lineStyleValue: lineStyles[0],
    };

    this.changeBreaksCount = (e) => {
      this.setState({
        breaksCountValue: e.value,
      });
    };

    this.changeStyle = (e) => {
      this.setState({
        lineStyleValue: e.value,
      });
    };

    this.changeBreaksEnabledState = (e) => {
      this.setState({
        autoBreaksEnabledValue: e.value,
      });
    };
  }

  render() {
    return (
      <div>
        <Chart
          id="chart"
          title={'Relative Masses of the Heaviest\n Solar System Objects'}
          dataSource={dataSource}>
          <Series
            valueField="mass"
            argumentField="name"
            type="bar" />
          <ValueAxis
            visible={true}
            autoBreaksEnabled={this.state.autoBreaksEnabledValue}
            maxAutoBreakCount={this.state.breaksCountValue}>
            <BreakStyle line={this.state.lineStyleValue} />
          </ValueAxis>
          <Legend visible={false} />
          <Tooltip enabled={true} />
        </Chart>
        <div className="options">
          <div className="caption">Options</div>
          <div className="options-container">
            <div className="option">
              <CheckBox className="checkbox"
                text="Enable Breaks"
                onValueChanged={this.changeBreaksEnabledState}
                value={this.state.autoBreaksEnabledValue}>
              </CheckBox>
            </div>
            <div className="option">
              <span>Max Count </span>
              <SelectBox
                items={breaksCount}
                inputAttr={maxCountLabel}
                value={this.state.breaksCountValue}
                onValueChanged={this.changeBreaksCount}
                width={80}>
              </SelectBox>
            </div>
            <div className="option">
              <span>Style </span>
              <SelectBox
                items={lineStyles}
                inputAttr={lineStyleLabel}
                value={this.state.lineStyleValue}
                onValueChanged={this.changeStyle}
                width={120}>
              </SelectBox>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import {
  Chart,
  Series,
  ArgumentAxis,
  Legend,
  Label,
} from 'devextreme-react/chart';
import { overlappingModes, population, seriesTypeLabel } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMode: overlappingModes[0],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Chart
          id="chart"
          dataSource={population}
          title="Population by Countries"
        >
          <Series argumentField="country" />
          <ArgumentAxis>
            <Label
              wordWrap="none"
              overlappingBehavior={this.state.currentMode}
            />
          </ArgumentAxis>
          <Legend visible={false} />
        </Chart>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Overlapping Modes: </span>
            <SelectBox
              dataSource={overlappingModes}
              value={this.state.currentMode}
              inputAttr={seriesTypeLabel}
              onValueChanged={this.handleChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleChange(e) {
    this.setState({ currentMode: e.value });
  }
}

export default App;

import React from 'react';
import RangeSelector, { Margin, Scale, MinorTick, Marker, Label, Behavior, SliderMarker } from 'devextreme-react/range-selector';
import { SelectBox } from 'devextreme-react/select-box';

const startValue = new Date(2011, 0, 1);
const endValue = new Date(2011, 11, 31);
const behaviorModes = ['onMoving', 'onMovingComplete'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workingDaysCount: calculateWorkdays([startValue, endValue]),
      behaviorMode: behaviorModes[0]
    };
    this.processRange = this.processRange.bind(this);
    this.setBehavior = this.setBehavior.bind(this);
  }
  render() {
    return (
      <div id="range-selector-demo">
        <RangeSelector
          id="range-selector"
          title="Calculate the Working Days Count in a Date Period"
          onValueChanged={this.processRange}
        >
          <Margin top={50} />
          <Scale startValue={startValue} endValue={endValue} minorTickInterval="day" tickInterval="month">
            <MinorTick visible={false} />
            <Marker visible={false} />
            <Label format="MMM" />
          </Scale>
          <Behavior callValueChanged={this.state.behaviorMode} />
          <SliderMarker format="dd EEEE" />
        </RangeSelector>
        <h2>Working days count: { this.state.workingDaysCount }</h2>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Handle Range Changes </span>
            <SelectBox
              dataSource={behaviorModes}
              width={210}
              value={this.state.behaviorMode}
              onValueChanged={this.setBehavior}
            />
          </div>
        </div>
      </div>
    );
  }
  processRange(e) {
    this.setState({
      workingDaysCount: calculateWorkdays(e.value)
    });
  }
  setBehavior(data) {
    this.setState({
      behaviorMode: data.value
    });
  }
}

function calculateWorkdays([start, end]) {
  const currentDate = new Date(start);
  let workingDaysCount = 0;

  while (currentDate <= end) {
    if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
      workingDaysCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return workingDaysCount;
}

export default App;

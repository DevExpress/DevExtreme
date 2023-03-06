import React from 'react';

import CircularGauge, {
  Geometry,
  Scale as CircularScale,
  Size as CircularSize,
  ValueIndicator as CircularValueIndicator,
} from 'devextreme-react/circular-gauge';

import LinearGauge, {
  Label,
  MinorTick,
  Scale as LinearScale,
  Size as LinearSize,
  ValueIndicator as LinearValueIndicator,
} from 'devextreme-react/linear-gauge';

import Slider from 'devextreme-react/slider';

import Indicator from './Indicator.js';

const color = '#f05b41';

function CenterTemplate(gauge) {
  return (
    <svg>
      <circle cx="100" cy="100" r="55" strokeWidth="2" stroke={color} fill="transparent"></circle>
      <text textAnchor="middle" alignmentBaseline="middle" y="100" x="100" fontSize="50" fontWeight="lighter" fill={color}>{gauge.value()}</text>
    </svg>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speedValue: 40,
    };

    this.handleSpeedChange = ({ value }) => {
      this.setState({ speedValue: value });
    };
  }

  render() {
    const { speedValue } = this.state;
    return (
      <div id="gauge-demo">

        <div id="gauge-container">
          <div className="left-section">
            <Indicator
              value={speedValue / 2}
              inverted={false}
              startAngle={180}
              endAngle={90} color={color}
            />
            <Indicator
              value={speedValue / 2}
              inverted={true}
              startAngle={-90}
              endAngle={-180}
              color={color}
            />
          </div>
          &nbsp;
          <div className="center-section">
            <CircularGauge value={speedValue} centerRender={CenterTemplate}>
              <CircularSize width={260} />
              <CircularScale
                startValue={20}
                endValue={200}
                tickInterval={20}
                minorTickInterval={10}
              />
              <Geometry startAngle={225} endAngle={315} />
              <CircularValueIndicator
                indentFromCenter={55}
                color={color}
                spindleSize={0}
                spindleGapSize={0}
              />
            </CircularGauge>

            <LinearGauge value={50 - speedValue * 0.24} id="fuel-gauge">
              <LinearSize width={90} height={20} />
              <LinearScale
                startValue={0}
                endValue={50}
                tickInterval={25}
                minorTickInterval={12.5}
              >
                <MinorTick visible={true} />
                <Label visible={false} />
              </LinearScale>
              <LinearValueIndicator
                size={8}
                offset={7}
                color={color}
              />
            </LinearGauge>
          </div>
          &nbsp;
          <div className="right-section">
            <Indicator
              value={speedValue / 2}
              inverted={true}
              startAngle={90}
              endAngle={0}
              color={color}
            />
            <Indicator
              value={speedValue / 2}
              inverted={false}
              startAngle={0}
              endAngle={-90}
              color={color}
            />
          </div>
        </div>

        <Slider
          value={this.state.speedValue}
          onValueChanged={this.handleSpeedChange}
          width={155}
          min={0}
          max={200}
          id="slider"
        />
      </div>
    );
  }
}

export default App;

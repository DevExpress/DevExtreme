import React from 'react';
import { LinearGauge, Scale, Label, ValueIndicator } from 'devextreme-react/linear-gauge';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <div className="long-title">
          <h3>Available Disk Space</h3>
        </div>
        <div id="gauge-demo">
          <LinearGauge
            id="c1"
            value={75}
          >
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <ValueIndicator
              type="rectangle"
              color="#9B870C"
            ></ValueIndicator>
          </LinearGauge>
          <LinearGauge
            id="c2"
            value={80}
          >
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >

              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <ValueIndicator
              type="rhombus"
              color="#779ECB"
            ></ValueIndicator>
          </LinearGauge>
          <LinearGauge
            id="c3"
            value={65}
          >
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >

              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <ValueIndicator
              type="circle"
              color="#8FBC8F"
            ></ValueIndicator>
          </LinearGauge>
          <LinearGauge
            id="c4"
            value={90}
          >
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >

              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <ValueIndicator
              type="rangebar"
              color="#483D8B"
            ></ValueIndicator>
          </LinearGauge>
          <LinearGauge
            id="c5"
            value={70}
          >
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <ValueIndicator
              type="textCloud"
              color="#734F96"
            ></ValueIndicator>
          </LinearGauge>
          <LinearGauge
            id="c6"
            value={85}
          >
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >

              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <ValueIndicator
              type="triangleMarker"
              color="#f05b41"
            ></ValueIndicator>
          </LinearGauge>
        </div>
      </div>
    );
  }

  customizeText({ valueText }) {
    return `${valueText} %`;
  }
}

export default App;

import React from 'react';
import { CircularGauge, ValueIndicator, Scale, Label, Geometry } from 'devextreme-react/circular-gauge';

class App extends React.Component {

  render() {
    return (
      <div>
        <div className="long-title">
          <h3>Power of Engines</h3>
        </div>
        <div id="gauge-demo">
          <CircularGauge
            id="rectangleNeedle"
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
              type="rectangleNeedle"
              color="#9B870C"
            ></ValueIndicator>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>
          </CircularGauge>&nbsp;
          <CircularGauge
            id="twoColorNeedle"
            value={80}
          >
            <ValueIndicator
              type="twoColorNeedle"
              color="#779ECB"
              secondColor="#734F96"
            ></ValueIndicator>
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>
          </CircularGauge>&nbsp;
          <CircularGauge
            id="triangleNeedle"
            value={65}
          >
            <ValueIndicator
              type="triangleNeedle"
              color="#8FBC8F"
            ></ValueIndicator>
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>
          </CircularGauge>
          <CircularGauge
            id="rangebar"
            value={90}
          >
            <ValueIndicator
              type="rangebar"
              color="#f05b41"
            ></ValueIndicator>
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>
          </CircularGauge>&nbsp;
          <CircularGauge
            id="textCloud"
            value={70}
          >

            <ValueIndicator
              type="textCloud"
              color="#483D8B"
            ></ValueIndicator>
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>
          </CircularGauge>&nbsp;
          <CircularGauge
            id="triangleMarker"
            value={85}
          >
            <ValueIndicator
              type="triangleMarker"
              color="#e0e33b"
            ></ValueIndicator>
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={50}
            >
              <Label customizeText={this.customizeText}></Label>
            </Scale>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>

          </CircularGauge>
        </div>
      </div>
    );
  }

  customizeText({ valueText }) {
    return `${valueText} %`;
  }
}

export default App;

import React from 'react';
import { CircularGauge, Scale, Geometry } from 'devextreme-react/circular-gauge';

class App extends React.Component {

  render() {
    return (
      <div>
        <div className="long-title">
          <h3>Humidity in Rooms (%)</h3>
        </div>
        <div id="gauge-demo">
          <CircularGauge
            id="gaugeOptions1"
            className="gauge"
            value={80}
          >
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={10}
            ></Scale>
            <Geometry
              startAngle={180}
              endAngle={90}
            >
            </Geometry>
          </CircularGauge>
          <CircularGauge
            id="gaugeOptions2"
            className="gauge"
            value={75}
          >
            <Scale
              startValue={100}
              endValue={0}
              tickInterval={10}
            ></Scale>
            <Geometry
              startAngle={90}
              endAngle={0}
            >
            </Geometry>
          </CircularGauge>
          <CircularGauge
            id="gaugeOptions3"
            className="gauge"
            value={70}
          >
            <Scale
              startValue={100}
              endValue={0}
              tickInterval={10}
            ></Scale>
            <Geometry
              startAngle={-90}
              endAngle={-180}
            >
            </Geometry>
          </CircularGauge>
          <CircularGauge
            id="gaugeOptions4"
            className="gauge"
            value={68}
          >
            <Scale
              startValue={0}
              endValue={100}
              tickInterval={10}
            ></Scale>
            <Geometry
              startAngle={0}
              endAngle={-90}
            >
            </Geometry>
          </CircularGauge>
        </div>
      </div>
    );
  }
}

export default App;

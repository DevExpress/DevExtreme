import React from 'react';
import {
  CircularGauge, Scale, Geometry, SubvalueIndicator,
} from 'devextreme-react/circular-gauge';

const subValues = [2, 8];

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="long-title">
          <h3>Grades of Goods</h3>
        </div>
        <div id="gauge-demo">
          <CircularGauge
            id="triangleMarker"
            value={8}
            subvalues={subValues}
          >
            <SubvalueIndicator
              type="triangleMarker"
              color="#8FBC8F"
            ></SubvalueIndicator>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>
            <Scale
              startValue={0}
              endValue={10}
              tickInterval={1}
            >
            </Scale>
          </CircularGauge>
          <CircularGauge
            id="rectangleNeedle"
            value={9}
            subvalues={subValues}
          >

            <SubvalueIndicator
              type="rectangleNeedle"
              color="#9B870C"
            ></SubvalueIndicator>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>
            <Scale
              startValue={0}
              endValue={10}
              tickInterval={1}
            >
            </Scale>
          </CircularGauge>
          <CircularGauge
            id="triangleNeedle"
            value={5}
            subvalues={subValues}
          >

            <SubvalueIndicator
              type="triangleNeedle"
              color="#779ECB"
            ></SubvalueIndicator>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>
            <Scale
              startValue={0}
              endValue={10}
              tickInterval={1}
            >
            </Scale>
          </CircularGauge>
          <CircularGauge
            id="textCloud"
            value={6}
            subvalues={subValues}>
            <SubvalueIndicator
              type="textCloud"
              color="#f05b41"
            ></SubvalueIndicator>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>
            <Scale
              startValue={0}
              endValue={10}
              tickInterval={1}
            >
            </Scale>
          </CircularGauge>
          <CircularGauge
            id="twoColorNeedle"
            value={4}
            subvalues={subValues}>

            <SubvalueIndicator
              type="twoColorNeedle"
              color="#779ECB"
              secondColor="#734F96"
            ></SubvalueIndicator>
            <Geometry
              startAngle={180}
              endAngle={0}>
            </Geometry>
            <Scale
              startValue={0}
              endValue={10}
              tickInterval={1}
            >
            </Scale>
          </CircularGauge>
        </div>
      </div>
    );
  }
}

export default App;

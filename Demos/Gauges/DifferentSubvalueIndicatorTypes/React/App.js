import React from 'react';
import { CircularGauge, Scale, Geometry, SubvalueIndicator } from 'devextreme-react/circular-gauge';

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
            subvalues={[2, 8]}
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
          </CircularGauge>&nbsp;
          <CircularGauge
            id="rectangleNeedle"
            value={9}
            subvalues={[2, 8]}
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
          </CircularGauge>&nbsp;
          <CircularGauge
            id="triangleNeedle"
            value={5}
            subvalues={[2, 8]}
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
            subvalues={[2, 8]}>
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
          </CircularGauge>&nbsp;
          <CircularGauge
            id="twoColorNeedle"
            value={4}
            subvalues={[2, 8]}>

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

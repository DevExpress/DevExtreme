import React from 'react';
import {
  LinearGauge, Scale, Label, SubvalueIndicator,
} from 'devextreme-react/linear-gauge';

const subValues = [18, 43];

function customizeText({ valueText }) {
  return `$${valueText}`;
}

function App() {
  return (
    <div>
      <div className="long-title">
        <h3>Current Price (with Min and Max)</h3>
      </div>
      <div id="gauge-demo">
        <LinearGauge
          id="c1"
          value={24}
          subvalues={subValues}
        >
          <Scale
            startValue={10}
            endValue={50}
            tickInterval={10}
          >
            <Label customizeText={customizeText}></Label>
          </Scale>
          <SubvalueIndicator
            type="rectangle"
            color="#9B870C"
          ></SubvalueIndicator>
        </LinearGauge>
        <LinearGauge
          id="c2"
          value={38}
          subvalues={subValues}
        >
          <Scale
            startValue={10}
            endValue={50}
            tickInterval={10}
          >
            <Label customizeText={customizeText}></Label>
          </Scale>
          <SubvalueIndicator
            type="rhombus"
            color="#779ECB"
          ></SubvalueIndicator>
        </LinearGauge>
        <LinearGauge
          id="c3"
          value={21}
          subvalues={subValues}
        >
          <Scale
            startValue={10}
            endValue={50}
            tickInterval={10}
          >
            <Label customizeText={customizeText}></Label>
          </Scale>
          <SubvalueIndicator
            type="circle"
            color="#8FBC8F"
          ></SubvalueIndicator>
        </LinearGauge>
        <LinearGauge
          id="c4"
          value={42}
          subvalues={subValues}
        >
          <Scale
            startValue={10}
            endValue={50}
            tickInterval={10}
          >
            <Label customizeText={customizeText}></Label>
          </Scale>
          <SubvalueIndicator
            type="textCloud"
            color="#734F96"
          ></SubvalueIndicator>
        </LinearGauge>
        <LinearGauge id="c5"
          value={28}
          subvalues={subValues}
        >
          <Scale
            startValue={10}
            endValue={50}
            tickInterval={10}
          >
            <Label customizeText={customizeText}></Label>
          </Scale>
          <SubvalueIndicator
            type="triangleMarker"
            color="#f05b41"
          ></SubvalueIndicator>
        </LinearGauge>
      </div>
    </div>
  );
}

export default App;

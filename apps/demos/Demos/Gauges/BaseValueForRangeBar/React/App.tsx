import React from 'react';
import {
  CircularGauge, Geometry, Scale, Label, ValueIndicator,
} from 'devextreme-react/circular-gauge';
import {
  LinearGauge,
  Geometry as LinearGaugeGeometry,
  Scale as LinearGaugeScale,
  Label as LinearGaugeLabel,
  ValueIndicator as LinearValueIndicator,
} from 'devextreme-react/linear-gauge';

function customizeText({ valueText }) {
  return `${valueText}°`;
}

function App() {
  return (
    <div>
      <div className="long-title">
        <h3>Deviation from the Target (Horizontal and Vertical)</h3>
      </div>
      <div id="gauge-demo">
        <CircularGauge
          id="c1"
          value={20}
        >
          <Geometry startAngle={135} endAngle={45} />
          <Scale startValue={45} endValue={-45} tickInterval={45}>
            <Label customizeText={customizeText} />
          </Scale>
          <ValueIndicator baseValue={0} type="rangeBar" />
        </CircularGauge>
        <LinearGauge
          id="c2"
          value={-10}
        >
          <LinearGaugeGeometry orientation="vertical" />
          <LinearGaugeScale startValue={-45} endValue={45} tickInterval={45}>
            <LinearGaugeLabel customizeText={customizeText} />
          </LinearGaugeScale>
          <LinearValueIndicator baseValue={0} />
        </LinearGauge>
      </div>
    </div>
  );
}

export default App;

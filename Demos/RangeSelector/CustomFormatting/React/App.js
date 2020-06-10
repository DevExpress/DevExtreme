import React from 'react';
import RangeSelector, { Margin, Scale, Label, SliderMarker, Behavior, Format } from 'devextreme-react/range-selector';

function App() {
  return (
    <RangeSelector
      id="range-selector"
      title="Select a Lead Concentration in Water"
    >
      <Margin top={50} />
      <Scale minorTickInterval={0.001} tickInterval={0.005} startValue={0.004563} endValue={0.04976}>
        <Label>
          <Format type="fixedPoint" precision={3} />
        </Label>
      </Scale>
      <SliderMarker customizeText={formatText}>
        <Format type="fixedPoint" precision={4} />
      </SliderMarker>
      <Behavior snapToTicks={false} />
    </RangeSelector>
  );
}

function formatText({ valueText }) {
  return `${valueText } mg/L`;
}

export default App;

import React from 'react';
import RangeSelector, {
  Margin, Scale, MinorTick, Label, SliderMarker,
} from 'devextreme-react/range-selector';

const defaultValue = [40000, 80000];

function App() {
  return (
    <RangeSelector
      id="range-selector"
      title="Select House Price Range"
      defaultValue={defaultValue}
    >
      <Margin top={50} />
      <Scale
        startValue={15000}
        endValue={150000}
        minorTickInterval={500}
        tickInterval={15000}>
        <MinorTick visible={false} />
        <Label format="currency" />
      </Scale>
      <SliderMarker format="currency" />
    </RangeSelector>
  );
}

export default App;

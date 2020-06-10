import React from 'react';
import { RangeSelector, Margin, Scale, MinorTick, SliderMarker } from 'devextreme-react/range-selector';

const startValue = new Date(2011, 1, 1);
const endValue = new Date(2011, 6, 1);
const range = [new Date(2011, 1, 5), new Date(2011, 2, 5)];

function App() {
  return (
    <RangeSelector
      id="range-selector"
      title="Select a Vacation Period"
      defaultValue={range}
    >
      <Margin top={50} />
      <Scale startValue={startValue} endValue={endValue} minorTickInterval="day" tickInterval="week" minRange="week" maxRange="month">
        <MinorTick visible={false} />
      </Scale>
      <SliderMarker format="monthAndDay" />
    </RangeSelector>
  );
}

export default App;

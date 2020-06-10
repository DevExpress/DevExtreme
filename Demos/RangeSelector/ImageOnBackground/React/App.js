import React from 'react';
import RangeSelector, { Margin, Background, Image, Indent, SliderMarker, Scale, TickInterval, MinorTickInterval, Label } from 'devextreme-react/range-selector';

const startValue = new Date(2012, 8, 29, 0, 0, 0);
const endValue = new Date(2012, 8, 29, 24, 0, 0);
const range = [new Date(2012, 8, 29, 11, 0, 0), new Date(2012, 8, 29, 17, 0, 0)];

function App() {
  return (
    <RangeSelector
      id="range-selector"
      title="Select a Time Period"
      defaultValue={range}
    >
      <Margin top={50} bottom={0} />
      <Background>
        <Image url="../../../../images/RangeImage.png" location="full" />
      </Background>
      <Indent left={65} right={65} />
      <SliderMarker placeholderHeight={30} format="shorttime" />
      <Scale startValue={startValue} endValue={endValue} placeholderHeight={20}>
        <TickInterval hours={2} />
        <MinorTickInterval hours={1} />
        <Label format="shorttime" />
      </Scale>
    </RangeSelector>
  );
}

export default App;

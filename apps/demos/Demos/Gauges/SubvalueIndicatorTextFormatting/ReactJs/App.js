import React from 'react';
import {
  CircularGauge,
  Scale,
  Label,
  SubvalueIndicator,
  Text,
  Export,
  Title,
  Font,
} from 'devextreme-react/circular-gauge';

const subvalues = [2700];
const format = {
  type: 'thousands',
  precision: 1,
};
function customizeText({ valueText }) {
  return `${valueText} °C`;
}
function App() {
  return (
    <CircularGauge
      id="gauge"
      value={2200}
      subvalues={subvalues}
    >
      <Scale
        startValue={0}
        endValue={3000}
        tickInterval={500}
      >
        <Label customizeText={customizeText} />
      </Scale>
      <SubvalueIndicator type="textCloud">
        <Text
          format={format}
          customizeText={customizeText}
        />
      </SubvalueIndicator>
      <Export enabled={true} />
      <Title text="Oven Temperature (includes Recommended)">
        <Font size={28} />
      </Title>
    </CircularGauge>
  );
}
export default App;

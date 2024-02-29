import React from 'react';
import {
  BarGauge, Label, Export, Title, Font,
} from 'devextreme-react/bar-gauge';

const values = [-21.3, 14.8, -30.9, 45.2];
function customizeText({ valueText }) {
  return `${valueText} mm`;
}
function App() {
  return (
    <BarGauge
      id="gauge"
      startValue={-50}
      endValue={50}
      baseValue={0}
      values={values}
      palette="Ocean"
    >
      <Label customizeText={customizeText} />
      <Export enabled={true} />
      <Title text="Deviations in the Manufactured Parts">
        <Font size={28} />
      </Title>
    </BarGauge>
  );
}
export default App;

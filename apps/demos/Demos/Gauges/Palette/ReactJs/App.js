import React from 'react';
import {
  BarGauge, Label, Export, Title, Font,
} from 'devextreme-react/bar-gauge';

const values = [-2.13, 1.48, -3.09, 4.52, 4.9, 3.9];
function App() {
  return (
    <BarGauge
      id="gauge"
      startValue={-5}
      endValue={5}
      baseValue={0}
      values={values}
      palette="Ocean"
    >
      <Label format="##.## mm;-##.## mm" />
      <Export enabled={true} />
      <Title text="Deviations in the Manufactured Parts">
        <Font size={28} />
      </Title>
    </BarGauge>
  );
}
export default App;

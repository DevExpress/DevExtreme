import React from 'react';
import {
  BarGauge, Label, Export, Title, Font,
} from 'devextreme-react/bar-gauge';

const values = [47.27, 65.32, 84.59, 71.86];

const format = {
  type: 'fixedPoint',
  precision: 1,
};

function customizeText({ valueText }) {
  return `${valueText} %`;
}

function App() {
  return (
    <BarGauge
      id="gauge"
      startValue={0}
      endValue={100}
      defaultValues={values}
    >
      <Label indent={30} format={format} customizeText={customizeText} />
      <Export enabled={true} />
      <Title text={"Series' Ratings"}>
        <Font size={28} />
      </Title>
    </BarGauge>
  );
}

export default App;

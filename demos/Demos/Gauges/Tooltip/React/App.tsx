import React from 'react';
import {
  BarGauge, Label, Tooltip, Export, Title, Font, Legend,
} from 'devextreme-react/bar-gauge';

interface ScaleValue {
  index: number;
  value: number;
  valueText: string;
}

interface BarItem {
  color?: string,
  index?: number,
  value?: number,
}

const values = [121.4, 135.4, 115.9, 141.1, 127.5];

function customizeTooltip(arg: ScaleValue) {
  return {
    text: getText(arg, arg.valueText),
  };
}

function customizeText(arg: {
  item: BarItem,
  text: any,
}) {
  return getText(arg.item, arg.text);
}

function getText(item: BarItem, text: string) {
  return `Racer ${(item.index + 1)} - ${text} km/h`;
}

function App() {
  return (
    <BarGauge
      id="gauge"
      startValue={0}
      endValue={200}
      defaultValues={values}
    >
      <Label visible={false} />
      <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
      <Export enabled={true} />
      <Title text="Average Speed by Racer">
        <Font size={28} />
      </Title>
      <Legend visible={true} customizeText={customizeText} verticalAlignment="bottom" horizontalAlignment="center" />
    </BarGauge>
  );
}

export default App;

import React from 'react';
import PieChart, {
  Legend,
  Series,
  Export,
  Label,
  SmallValuesGrouping,
  Connector,
} from 'devextreme-react/pie-chart';
import { internetLanguages } from './data.ts';

function customizeLabel(point: { argumentText: string; valueText: string; }) {
  return `${point.argumentText}: ${point.valueText}%`;
}

function App() {
  return (
    <PieChart
      id="pie"
      type="doughnut"
      title="Top Internet Languages"
      palette="Soft Pastel"
      dataSource={internetLanguages}
    >
      <Series argumentField="language" valueField="percent">
        <SmallValuesGrouping mode="topN" topCount={3} />
        <Label
          visible={true}
          format="fixedPoint"
          customizeText={customizeLabel}
        >
          <Connector visible={true} width={1} />
        </Label>
      </Series>
      <Export enabled={true} />
      <Legend horizontalAlignment="center" verticalAlignment="bottom" />
    </PieChart>
  );
}

export default App;

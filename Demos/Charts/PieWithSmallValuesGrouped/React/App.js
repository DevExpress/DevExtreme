import React from 'react';

import PieChart, {
  Series,
  Label,
  Connector,
  SmallValuesGrouping,
  Legend,
  Export
} from 'devextreme-react/pie-chart';

import { dataSource } from './data.js';

function App() {
  return (
    <PieChart
      id="pie"
      dataSource={dataSource}
      palette="Bright"
      title="Top internet languages"
    >
      <Series
        argumentField="language"
        valueField="percent"
      >
        <Label visible={true} customizeText={formatLabel} format="fixedPoint">
          <Connector visible={true} width={0.5} />
        </Label>
        <SmallValuesGrouping threshold={4.5} mode="smallValueThreshold" />
      </Series>
      <Legend horizontalAlignment="center" verticalAlignment="bottom" />
      <Export enabled={true} />
    </PieChart>
  );
}

function formatLabel(arg) {
  return `${arg.argumentText}: ${arg.valueText}%`;
}

export default App;

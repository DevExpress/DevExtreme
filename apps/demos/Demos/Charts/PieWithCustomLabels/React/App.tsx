import React from 'react';
import PieChart, {
  Legend,
  Export,
  Series,
  Label,
  Font,
  Connector,
} from 'devextreme-react/pie-chart';
import { dataSource } from './data.ts';

function customizeText(arg: { valueText: string; percentText: string; }) {
  return `${arg.valueText} (${arg.percentText})`;
}

function App() {
  return (
    <PieChart id="pie"
      palette="Bright"
      dataSource={dataSource}
      title="Olympic Medals in 2008"
    >
      <Legend
        orientation="horizontal"
        itemTextPosition="right"
        horizontalAlignment="center"
        verticalAlignment="bottom"
        columnCount={4} />
      <Export enabled={true} />
      <Series argumentField="country" valueField="medals">
        <Label
          visible={true}
          position="columns"
          customizeText={customizeText}>
          <Font size={16} />
          <Connector visible={true} width={0.5} />
        </Label>
      </Series>
    </PieChart>
  );
}

export default App;

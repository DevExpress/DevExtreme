import React from 'react';
import PieChart, {
  Legend,
  Export,
  Series,
  Label,
  Font,
  Connector,
  CommonSeriesSettings,
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
      <CommonSeriesSettings>
        <Label
          visible={true}
          position="columns"
          customizeText={customizeText}>
          <Font size={16} />
          <Connector visible={true} width={0.5} />
        </Label>
      </CommonSeriesSettings>
      <Series argumentField="country" valueField="medals" />
    </PieChart>
  );
}

export default App;

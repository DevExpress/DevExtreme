import React from 'react';
import PieChart, {
  CommonSeriesSettings,
  Legend,
  Series,
  Export,
  Label,
  Title,
  Tooltip,
  Subtitle,
} from 'devextreme-react/pie-chart';
import { exportImportData } from './data.js';

function customizeTooltip(arg) {
  return { text: `${arg.argumentText}<br>${arg.seriesName}: ${arg.valueText}B` };
}
function App() {
  return (
    <PieChart
      id="pie"
      type="doughnut"
      innerRadius={0.2}
      palette="Ocean"
      dataSource={exportImportData}
    >
      <Title text="Imports/Exports of Goods and Services">
        <Subtitle text="(billion US$, 2012)" />
      </Title>

      <CommonSeriesSettings>
        <Label visible={false} />
      </CommonSeriesSettings>
      <Series
        name="Export"
        argumentField="Country"
        valueField="Export"
      />
      <Series
        name="Import"
        argumentField="Country"
        valueField="Import"
      />

      <Export enabled={true} />
      <Legend visible={true} />

      <Tooltip
        enabled={true}
        format="currency"
        customizeTooltip={customizeTooltip}
      />
    </PieChart>
  );
}
export default App;

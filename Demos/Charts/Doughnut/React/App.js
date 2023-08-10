import React from 'react';
import PieChart, {
  Legend,
  Series,
  Tooltip,
  Format,
  Label,
  Connector,
  Export,
} from 'devextreme-react/pie-chart';
import { populationByRegions } from './data.js';

function customizeTooltip(arg) {
  return {
    text: `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%`,
  };
}

function App() {
  return (
    <PieChart
      id="pie"
      type="doughnut"
      title="The Population of Continents and Regions"
      palette="Soft Pastel"
      dataSource={populationByRegions}
    >
      <Series argumentField="region">
        <Label visible={true} format="millions">
          <Connector visible={true} />
        </Label>
      </Series>
      <Export enabled={true} />
      <Legend margin={0} horizontalAlignment="right" verticalAlignment="top" />
      <Tooltip enabled={true} customizeTooltip={customizeTooltip}>
        <Format type="millions" />
      </Tooltip>
    </PieChart>
  );
}

export default App;

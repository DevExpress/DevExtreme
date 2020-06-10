import React from 'react';

import PieChart, {
  Series,
  Tooltip,
  Export
} from 'devextreme-react/pie-chart';

import { populationData } from './data.js';
import TooltipTemplate from './TooltipTemplate.js';

function App() {
  return (
    <PieChart
      id="pie-chart"
      dataSource={populationData}
      title="Top 10 Most Populated States in US"
      palette="Bright"
    >
      <Series
        argumentField="name"
        valueField="population"
      />
      <Tooltip
        enabled={true}
        contentRender={TooltipTemplate}
      />
      <Export enabled={true} />
    </PieChart>
  );
}

export default App;

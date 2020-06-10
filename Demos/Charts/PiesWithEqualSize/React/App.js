import React from 'react';

import PieChart, {
  Series,
  Label,
  Legend
} from 'devextreme-react/pie-chart';

import { countries, waterLandRatio } from './data.js';

const pieCharts = [{
  title: 'Area of Countries',
  palette: 'Soft',
  dataSource: countries
}, {
  title: 'Water/Land Ratio',
  palette: 'Soft Pastel',
  dataSource: waterLandRatio
}];

function App() {
  const pies = pieCharts.map((options, i) => (
    <PieChart
      className="pie"
      key={i}
      title={options.title}
      palette={options.palette}
      sizeGroup="piesGroup"
      dataSource={options.dataSource}
    >
      <Series argumentField="name" valueField="area">
        <Label visible={true} format="percent" />
      </Series>
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
        itemTextPosition="right"
        rowCount={2}
      />
    </PieChart>
  ));

  return (
    <div className="pies-container">
      {pies}
    </div>
  );
}

export default App;

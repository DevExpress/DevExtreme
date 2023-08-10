import React from 'react';
import PieChart, {
  Legend,
  Series,
  Export,
  HoverStyle,
} from 'devextreme-react/pie-chart';
import { olympicMedals } from './data.js';

function pointClickHandler(arg) {
  arg.target.select();
}

function App() {
  return (
    <PieChart
      id="pie"
      type="doughnut"
      title="Olympic Medals in 2008"
      palette="Soft Pastel"
      dataSource={olympicMedals}
      onPointClick={pointClickHandler}
    >
      <Series argumentField="country" valueField="medals">
        <HoverStyle color="#ffd700" />
      </Series>
      <Export enabled={true} />
      <Legend
        margin={0}
        horizontalAlignment="right"
        verticalAlignment="top"
      />
    </PieChart>
  );
}

export default App;

import React from 'react';
import PieChart, {
  Series,
  Label,
  Connector,
  Size,
  Export,
  PieChartTypes,
} from 'devextreme-react/pie-chart';
import { areas } from './data.ts';

function pointClickHandler(e: PieChartTypes.PointClickEvent) {
  toggleVisibility(e.target);
}

function legendClickHandler(e: PieChartTypes.LegendClickEvent) {
  const arg = e.target;
  const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];
  toggleVisibility(item);
}

function toggleVisibility(item) {
  item.isVisible() ? item.hide() : item.show();
}

function App() {
  return (
    <PieChart
      id="pie"
      dataSource={areas}
      palette="Bright"
      title="Area of Countries"
      onPointClick={pointClickHandler}
      onLegendClick={legendClickHandler}
    >
      <Series argumentField="country" valueField="area">
        <Label visible={true}>
          <Connector visible={true} width={1} />
        </Label>
      </Series>

      <Size width={500} />
      <Export enabled={true} />
    </PieChart>
  );
}

export default App;

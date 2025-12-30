import React from 'react';
import PieChart, {
  Series,
  Label,
  Connector,
  Export,
} from 'devextreme-react/pie-chart';
import type { SeriesPoint } from 'devextreme/common/charts';
import {
  getStrokePattern,
  getSquarePattern,
  getLinearGradient,
  getRadialGradient,
  getPatternImage,
} from './utils.ts';
import { data } from './data.ts';

function customizeText(info: { argument: string; }): string {
  return info.argument;
}

type CustomizePointArg = {
  series: {
    getPointsByArg: (arg: string) => { getColor: () => string; }[];
  };
  argument: string;
};

function customizePoint(point: CustomizePointArg): SeriesPoint {
  const color = point.series.getPointsByArg(point.argument)[0].getColor();
  let fillId;
  switch (point.argument) {
    case 'Stripes':
      fillId = getStrokePattern(color);
      break;
    case 'Grid':
      fillId = getSquarePattern(color);
      break;
    case 'Linear Gradient':
      fillId = getLinearGradient(color);
      break;
    case 'Radial Gradient':
      fillId = getRadialGradient(color);
      break;
    case 'Image':
      fillId = getPatternImage(color);
      break;
    default:
      break;
  }

  return { color: { fillId } };
}

function App() {
  return (
    <PieChart
      id="pie"
      dataSource={data}
      customizePoint={customizePoint}
    >
      <Series
        argumentField='type'
        valueField='value'>
        <Label visible customizeText={customizeText}>
          <Connector visible />
        </Label>
      </Series>
      <Export enabled />
    </PieChart>
  );
}

export default App;

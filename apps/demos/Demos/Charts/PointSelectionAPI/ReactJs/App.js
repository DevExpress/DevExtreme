import React from 'react';
import {
  Chart,
  CommonSeriesSettings,
  Series,
  SelectionStyle,
  Hatching,
  Legend,
  Export,
} from 'devextreme-react/chart';
import { catBreedsData } from './data.js';

function onDone(e) {
  e.component.getSeriesByPos(0).getPointsByArg('Siamese')[0].select();
}
function onPointClick(e) {
  const point = e.target;
  if (point.isSelected()) {
    point.clearSelection();
  } else {
    point.select();
  }
}
function App() {
  return (
    <Chart
      id="chart"
      dataSource={catBreedsData}
      rotated={true}
      title="Most Popular US Cat Breeds"
      onDone={onDone}
      onPointClick={onPointClick}
    >
      <CommonSeriesSettings
        argumentField="breed"
        type="bar"
      />
      <Series
        valueField="count"
        name="breeds"
        color="#a3d6d2"
      >
        <SelectionStyle color="#ec2e7a">
          <Hatching direction="none" />
        </SelectionStyle>
      </Series>
      <Legend visible={false} />
      <Export enabled={true} />
    </Chart>
  );
}
export default App;

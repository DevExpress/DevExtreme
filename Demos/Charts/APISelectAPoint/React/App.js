import React from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  SelectionStyle,
  Hatching,
  Legend,
  Export
} from 'devextreme-react/chart';
import { catBreedsData } from './data.js';

class App extends React.Component {

  render() {
    return (
      <Chart
        id="chart"
        dataSource={catBreedsData}
        rotated={true}
        onDone={onDone}
        onPointClick={onPointClick}
        title="Most Popular US Cat Breeds"
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
}

function onDone({ component }) {
  component.getSeriesByPos(0).getPointsByArg('Siamese')[0].select();
}

function onPointClick({ target: point }) {
  if (point.isSelected()) {
    point.clearSelection();
  } else {
    point.select();
  }
}

export default App;

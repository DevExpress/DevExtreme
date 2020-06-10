import React from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  Label,
  Format,
  ValueAxis,
  Legend,
  Export
} from 'devextreme-react/chart';
import { exportData } from './data.js';

class App extends React.Component {

  render() {
    return (
      <Chart
        id="chart"
        dataSource={exportData}
        rotated={true}
        onPointClick={onPointClick}
        onLegendClick={onLegendClick}
        title="Economy - Export Change"
      >
        <CommonSeriesSettings
          argumentField="country"
          type="bar"
          hoverMode="allArgumentPoints"
          selectionMode="allArgumentPoints"
        >
          <Label visible={true}>
            <Format
              precision={1}
              type="percent"
            />
          </Label>
        </CommonSeriesSettings>
        <Series
          valueField="year2007"
          name="2007 - 2008"
        />
        <Series
          valueField="year2008"
          name="2008 - 2009"
        />
        <ValueAxis>
          <Label>
            <Format
              precision={1}
              type="percent"
            />
          </Label>
        </ValueAxis>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center">
        </Legend>
        <Export enabled={true} />
      </Chart>
    );
  }
}

function onPointClick({ target: point }) {
  point.select();
}

function onLegendClick({ target: series }) {
  if(series.isVisible()) {
    series.hide();
  } else {
    series.show();
  }
}

export default App;

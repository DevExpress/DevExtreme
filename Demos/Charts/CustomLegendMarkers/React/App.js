import React from 'react';

import { Chart, Series, CommonSeriesSettings, Point, Legend } from 'devextreme-react/chart';
import { dataSource } from './data.js';
import markerTemplate from './MarkerTemplate.js';

class App extends React.Component {

  onLegendClick(e) {
    e.target.isVisible() ? e.target.hide() : e.target.show();
  }

  render() {
    return (
      <Chart id="chart"
        title="Noisy and Original Signals"
        dataSource={dataSource}
        onLegendClick={this.onLegendClick}>
        <CommonSeriesSettings
          argumentField="argument">
          <Point visible={false}></Point>
        </CommonSeriesSettings>
        <Series
          valueField="originalValue"
          name="Original Signal"
        />
        <Series
          valueField="value"
          name="Noisy Signal"
        />
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          markerRender={markerTemplate}
        >
        </Legend>
      </Chart>
    );
  }
}

export default App;

import React from 'react';

import { Chart, SeriesTemplate, CommonSeriesSettings, Title } from 'devextreme-react/chart';
import { dataSource } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        palette="Soft"
        dataSource={dataSource}>
        <CommonSeriesSettings
          argumentField="age"
          valueField="number"
          type="bar"
          ignoreEmptyPoints={true}
        />
        <SeriesTemplate nameField="age" />
        <Title
          text="Age Breakdown of Facebook Users in the U.S."
          subtitle="as of January 2017"
        />
      </Chart>
    );
  }
}

export default App;

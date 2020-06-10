import React from 'react';

import { Chart, Series, CommonSeriesSettings, Legend, Export } from 'devextreme-react/chart';
import { dataSource } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        palette="Soft"
        title="Percent of Total Energy Production"
        dataSource={dataSource}
      >
        <CommonSeriesSettings
          argumentField="state"
          type="bar"
          ignoreEmptyPoints={true}
        />
        <Series valueField="oil" name="Oil Production" />
        <Series valueField="gas" name="Gas Production" />
        <Series valueField="coal" name="Coal Production" />
        <Legend verticalAlignment="bottom" horizontalAlignment="center" />
        <Export enabled={true} />
      </Chart>
    );
  }
}

export default App;

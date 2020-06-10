import React from 'react';

import { Chart, Series, CommonSeriesSettings, Legend, Export, Title } from 'devextreme-react/chart';
import { dataSource } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        palette="Soft"
        dataSource={dataSource}
      >
        <CommonSeriesSettings
          argumentField="state"
          type="bar"
          barPadding={0.5}
        />
        <Series valueField="year1970" name="1970" />
        <Series valueField="year1980" name="1980" />
        <Series valueField="year1990" name="1990" />
        <Series valueField="year2000" name="2000" />
        <Series valueField="year2008" name="2008" />
        <Series valueField="year2009" name="2009" />
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        />
        <Export enabled={true} />
        <Title text="Oil Production" subtitle="(in millions tonnes)" />
      </Chart>
    );
  }
}

export default App;

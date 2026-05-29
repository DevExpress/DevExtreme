import React from 'react';
import {
  Chart, Series, CommonSeriesSettings, Legend, Export, Title,
} from 'devextreme-react/chart';
import { dataSource } from './data.js';

function App() {
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
      <Series
        valueField="year1990"
        name="1990"
      />
      <Series
        valueField="year2000"
        name="2000"
      />
      <Series
        valueField="year2010"
        name="2010"
      />
      <Series
        valueField="year2020"
        name="2020"
      />
      <Series
        valueField="year2021"
        name="2021"
      />
      <Series
        valueField="year2022"
        name="2022"
      />
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
      />
      <Export enabled={true} />
      <Title
        text="Oil Production"
        subtitle="(in millions tonnes)"
      />
    </Chart>
  );
}
export default App;

import React from 'react';
import {
  Chart, CommonSeriesSettings, Series, Export, Legend, Point,
} from 'devextreme-react/chart';
import { yearSources, grossProductData } from './data.js';

function App() {
  return (
    <Chart
      id="chart"
      dataSource={grossProductData}
      stickyHovering={false}
      title="Great Lakes Gross State Product"
    >
      <CommonSeriesSettings
        argumentField="state"
        type="spline"
        hoverMode="includePoints"
      >
        <Point hoverMode="allArgumentPoints" />
      </CommonSeriesSettings>
      {yearSources.map((item) => (
        <Series
          key={item.value}
          valueField={item.value}
          name={item.name}
        />
      ))}
      <Export enabled={true} />
      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
        hoverMode="excludePoints"
      />
    </Chart>
  );
}
export default App;

import React from 'react';

import { Chart, Series, CommonSeriesSettings, Legend, ValueAxis, Title, Export, Tooltip, Border } from 'devextreme-react/chart';
import service from './data.js';

const dataSource = service.getMaleAgeData();

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        title="Population: Age Structure"
        dataSource={dataSource}
      >
        <CommonSeriesSettings argumentField="state" type="stackedBar" />
        <Series
          valueField="maleyoung"
          name="Male: 0-14"
          stack="male"
        />
        <Series
          valueField="malemiddle"
          name="Male: 15-64"
          stack="male"
        />
        <Series
          valueField="maleolder"
          name="Male: 65 and older"
          stack="male"
        />
        <Series
          valueField="femaleyoung"
          name="Female: 0-14"
          stack="female"
        />
        <Series
          valueField="femalemiddle"
          name="Female: 15-64"
          stack="female"
        />
        <Series
          valueField="femaleolder"
          name="Female: 65 and older"
          stack="female"
        />
        <ValueAxis>
          <Title text="Populations, millions" />
        </ValueAxis>
        <Legend position="inside"
          columnCount={2}
          customizeItems={customizeItems}
          horizontalAlignment="right">
          <Border visible={true} />
        </Legend>
        <Export enabled={true} />
        <Tooltip enabled={true} />
      </Chart>
    );
  }
}

function customizeItems(items) {
  var sortedItems = [];

  items.forEach(function(item) {
    var startIndex = item.series.stack === 'male' ? 0 : 3;
    sortedItems.splice(startIndex, 0, item);
  });
  return sortedItems;
}

export default App;

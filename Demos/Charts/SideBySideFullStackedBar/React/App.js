import React from 'react';

import { Chart, Series, CommonSeriesSettings, Legend, Export, Tooltip } from 'devextreme-react/chart';
import service from './data.js';

const dataSource = service.getMaleAgeData();

class App extends React.Component {
  customizeTooltip(arg) {
    return {
      text: `${arg.percentText } - ${ arg.valueText}`
    };
  }
  render() {
    return (
      <Chart
        id="chart"
        title="Population: Age Structure"
        dataSource={dataSource}
      >
        <CommonSeriesSettings
          argumentField="state"
          type="fullstackedbar"
        />
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
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        />
        <Export enabled={true} />
        <Tooltip
          enabled={true}
          customizeTooltip={this.customizeTooltip}
        />
      </Chart>
    );
  }
}

export default App;

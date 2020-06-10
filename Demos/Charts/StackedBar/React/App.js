import React from 'react';

import { Chart, Series, CommonSeriesSettings, Legend, ValueAxis, Title, Export, Tooltip } from 'devextreme-react/chart';
import service from './data.js';

const dataSource = service.getMaleAgeData();

class App extends React.Component {
  customizeTooltip(arg) {
    return {
      text: `${arg.seriesName } years: ${ arg.valueText}`
    };
  }
  render() {
    return (
      <Chart
        id="chart"
        title="Male Age Structure"
        dataSource={dataSource}
      >
        <CommonSeriesSettings argumentField="state" type="stackedBar" />
        <Series
          valueField="young"
          name="0-14"
        />
        <Series
          valueField="middle"
          name="15-64"
        />
        <Series
          valueField="older"
          name="65 and older"
        />
        <ValueAxis position="right">
          <Title text="millions" />
        </ValueAxis>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          itemTextPosition="top"
        />
        <Export enabled={true} />
        <Tooltip
          enabled={true}
          location="edge"
          customizeTooltip={this.customizeTooltip}
        />
      </Chart>
    );
  }
}

export default App;

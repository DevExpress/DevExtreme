import React from 'react';

import { Chart, Series, CommonSeriesSettings, Legend, Export, Tooltip, Title } from 'devextreme-react/chart';
import service from './data.js';

const dataSource = service.dataSource();

class App extends React.Component {
  customizeTooltip(arg) {
    return {
      text: `${arg.percentText} years: ${arg.valueText}`
    };
  }
  render() {
    return (
      <Chart
        id="chart"
        dataSource={dataSource}
      >
        <Title
          text="Energy Consumption in 2004"
          subtitle="(Millions of Tons, Oil Equivalent)"
        />
        <CommonSeriesSettings argumentField="country" type="fullstackedbar" />
        <Series valueField="hydro" name="Hydro-electric" />
        <Series valueField="oil" name="Oil" />
        <Series valueField="gas" name="Natural gas" />
        <Series valueField="coal" name="Coal" />
        <Series valueField="nuclear" name="Nuclear" />

        <Legend verticalAlignment="top"
          horizontalAlignment="center"
          itemTextPosition="right"
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

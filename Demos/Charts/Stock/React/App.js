import React from 'react';

import Chart, {
  CommonSeriesSettings,
  Series,
  Reduction,
  ArgumentAxis,
  Label,
  Format,
  ValueAxis,
  Title,
  Export,
  Tooltip
} from 'devextreme-react/chart';

import { dataSource } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        title="Stock Price"
        dataSource={dataSource}
      >
        <CommonSeriesSettings
          argumentField="date"
          type="stock"
        />
        <Series
          name="DELL"
          openValueField="o"
          highValueField="h"
          lowValueField="l"
          closeValueField="c"
        >
          <Reduction color="red" />
        </Series>
        <ArgumentAxis workdaysOnly={true}>
          <Label format="shortDate" />
        </ArgumentAxis>
        <ValueAxis tickInterval={1}>
          <Title text="US dollars" />
          <Label>
            <Format
              precision={0}
              type="currency"
            />
          </Label>
        </ValueAxis>
        <Export enabled={true} />
        <Tooltip
          enabled={true}
          customizeTooltip={this.customizeTooltip}
          location="edge"
        />
      </Chart>
    );
  }

  customizeTooltip(arg) {
    return {
      text: `Open: $${arg.openValue}<br/>
Close: $${arg.closeValue}<br/>
High: $${arg.highValue}<br/>
Low: $${arg.lowValue}<br/>`
    };
  }
}

export default App;

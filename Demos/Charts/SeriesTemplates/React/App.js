import React from 'react';

import Chart, {
  Legend,
  SeriesTemplate,
  Title,
  Subtitle,
  CommonSeriesSettings,
  Export
} from 'devextreme-react/chart';

import { dataSource } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        palette="Violet"
        dataSource={dataSource}>
        <SeriesTemplate
          nameField="year"
          customizeSeries={customizeSeries}
        />
        <CommonSeriesSettings
          argumentField="country"
          valueField="oil"
          type="bar"
        />
        <Title text="Oil Production">
          <Subtitle text="(in millions tonnes)" />
        </Title>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        />
        <Export enabled={true} />
      </Chart>
    );
  }
}

function customizeSeries(valueFromNameField) {
  return valueFromNameField === 2009 ? { type: 'line', label: { visible: true }, color: '#ff3f7a' } : {};
}

export default App;

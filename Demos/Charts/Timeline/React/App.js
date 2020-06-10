import React from 'react';

import { Chart, CommonSeriesSettings, Legend, SeriesTemplate, Animation, ArgumentAxis, Tick, Title } from 'devextreme-react/chart';
import dataSource from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart id="chart" dataSource={dataSource} barGroupPadding={0.2} rotated={true}>
        <ArgumentAxis categories={['Royal Houses']}>
          <Tick visible={false} />
        </ArgumentAxis>
        <Title text="The British Monarchy"
          subtitle="An Abbreviated Timeline"
        />
        <CommonSeriesSettings
          type="rangeBar"
          argumentField="monarch"
          rangeValue1Field="start"
          rangeValue2Field="end"
          barOverlapGroup="monarch"
        >
        </CommonSeriesSettings>
        <Legend verticalAlignment="bottom" horizontalAlignment="center">
          <Title text="Royal Houses" />
        </Legend>
        <SeriesTemplate nameField="house" />
        <Animation enabled={false} />
      </Chart>
    );
  }
}

export default App;

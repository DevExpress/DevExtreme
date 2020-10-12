import React from 'react';

import { Chart, Series, ArgumentAxis, Label, CommonSeriesSettings } from 'devextreme-react/chart';
import { dataSource } from './data.js';
import { LabelTemplate } from './LabelTemplate.js';

class App extends React.Component {

  render() {
    return (
      <Chart id="chart"
        title="Ice Hockey World Championship Gold Medal Winners"
        dataSource={dataSource}>
        <CommonSeriesSettings type="bar" argumentField="country">
          <Label visible="true"></Label>
        </CommonSeriesSettings>
        <Series
          name="Gold"
          valueField="gold"
          color="#ffd700" />
        <Series
          name="Silver"
          valueField="silver"
          color="#c0c0c0" />
        <Series
          name="Bronze"
          valueField="bronze"
          color="#cd7f32" />
        <ArgumentAxis>
          <Label render={LabelTemplate}></Label>
        </ArgumentAxis>
      </Chart>
    );
  }
}

export default App;

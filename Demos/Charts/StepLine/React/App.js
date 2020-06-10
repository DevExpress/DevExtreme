import React from 'react';
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  Export,
  Legend,
  Point,
  Label,
  Format
} from 'devextreme-react/chart';
import { medalSources, olympicAchievements } from './data.js';

class App extends React.Component {

  render() {
    return (
      <Chart
        id="container"
        dataSource={olympicAchievements}
        title="Australian Olympic Medal Count"
      >
        <CommonSeriesSettings
          type="stepline"
          argumentField="year"
        >
          <Point visible={false} />
        </CommonSeriesSettings>
        {
          medalSources.map(function(item) {
            return <Series key={item.value} valueField={item.value} name={item.name} color={item.color} />;
          })
        }
        <ArgumentAxis>
          <Label>
            <Format type="decimal" />
          </Label>
        </ArgumentAxis>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        />
        <Export enabled={true} />
      </Chart>
    );
  }
}

export default App;

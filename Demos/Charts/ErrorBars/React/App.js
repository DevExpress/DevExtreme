import React from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  ValueErrorBar,
  Pane,
  ArgumentAxis,
  ValueAxis,
  Export,
  Legend,
  Label,
  Title,
  Tooltip,
  Grid
} from 'devextreme-react/chart';
import { weatherData } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        dataSource={weatherData}
        defaultPane="bottom"
      >
        <CommonSeriesSettings argumentField="month" />
        <Series
          pane="top"
          valueField="avgT"
          name="Average Temperature, °C"
        >
          <ValueErrorBar
            lowValueField="avgLowT"
            highValueField="avgHighT"
            lineWidth={1}
            opacity={0.8}
          />
        </Series>
        <Series
          pane="bottom"
          valueField="avgH"
          type="bar"
          name="Average Humidity, %"
        >
          <ValueErrorBar
            type="fixed"
            value={3}
            lineWidth={1}
          />
        </Series>

        <Pane name="top" />
        <Pane name="bottom" />

        <ArgumentAxis>
          <Label displayMode="stagger" />
        </ArgumentAxis>
        <ValueAxis pane="top">
          <Grid visible={true} />
          <Title text="Temperature, °C" />
        </ValueAxis>
        <ValueAxis
          tickInterval={50}
          pane="bottom"
        >
          <Grid visible={true} />
          <Title text="Humidity, %" />
        </ValueAxis>

        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        />
        <Export enabled={true} />
        <Tooltip
          enabled={true}
          customizeTooltip={customizeTooltip}
        />
        <Title text="Weather in Los Angeles, California" />
      </Chart>
    );
  }
}

function customizeTooltip(pointInfo) {
  return {
    text: `${pointInfo.seriesName}: ${pointInfo.value
    } (range: ${pointInfo.lowErrorValue
    } - ${pointInfo.highErrorValue})`
  };
}

export default App;

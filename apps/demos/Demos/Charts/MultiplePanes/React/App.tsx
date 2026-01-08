import React from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  Pane,
  ValueAxis,
  Export,
  Legend,
  Label,
  Title,
  Grid,
} from 'devextreme-react/chart';
import { weatherData } from './data.ts';

function temperatureCustomizeText({ valueText }: { valueText: string }): string {
  return `${valueText} °C`;
}

function precipitationCustomizeText({ valueText }: { valueText: string }): string {
  return `${valueText} mm`;
}

function App() {
  return (
    <Chart
      id="chart"
      dataSource={weatherData}
      defaultPane="bottomPane"
      title="Weather in Glendale, CA"
    >
      <CommonSeriesSettings argumentField="month" />
      <Series
        pane="topPane"
        color="#b0daff"
        type="rangearea"
        rangeValue1Field="minT"
        rangeValue2Field="maxT"
        name="Monthly Temperature Ranges, °C"
      />
      <Series
        pane="topPane"
        valueField="avgT"
        name="Average Temperature, °C"
      >
        <Label
          visible={true}
          customizeText={temperatureCustomizeText}
        />
      </Series>
      <Series
        type="bar"
        valueField="prec"
        name="prec, mm"
      >
        <Label
          visible={true}
          customizeText={precipitationCustomizeText}
        />
      </Series>

      <Pane name="topPane" />
      <Pane name="bottomPane" />

      <ValueAxis pane="bottomPane">
        <Grid visible={true} />
        <Title text="Precipitation, mm" />
      </ValueAxis>
      <ValueAxis pane="topPane">
        <Grid visible={true} />
        <Title text="Temperature, °C" />
      </ValueAxis>

      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
      />
      <Export enabled={true} />
    </Chart>
  );
}

export default App;

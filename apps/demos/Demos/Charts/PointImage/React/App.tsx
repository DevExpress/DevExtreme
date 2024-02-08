import React from 'react';
import {
  Chart,
  CommonSeriesSettings,
  Series,
  ArgumentAxis,
  Grid,
  Label,
  Format,
  ValueAxis,
  Export,
  Legend,
  Point,
  IExportProps,
} from 'devextreme-react/chart';
import { iceHockeyStatistics } from './data.ts';

const exportFormats: IExportProps['formats'] = ['PNG', 'PDF', 'JPEG', 'GIF', 'SVG'];

function customizePoint(e: { value: number; }) {
  if (e.value === 1) {
    return { image: { url: '../../../../images/Charts/PointImage/icon-medal-gold.png', width: 20, height: 20 }, visible: true };
  }
  if (e.value === 2) {
    return { image: { url: '../../../../images/Charts/PointImage/icon-medal-silver.png', width: 20, height: 20 }, visible: true };
  }
  if (e.value === 3) {
    return { image: { url: '../../../../images/Charts/PointImage/icon-medal-bronse.png', width: 20, height: 20 }, visible: true };
  }
  return null;
}

function customizeText(e: { valueText: string; }) {
  if (e.valueText === '1') {
    return `${e.valueText}st place`;
  } if (e.valueText === '2') {
    return `${e.valueText}nd place`;
  } if (e.valueText === '3') {
    return `${e.valueText}rd place`;
  }
  return `${e.valueText}th place`;
}

function App() {
  return (
    <Chart
      id="chart"
      dataSource={iceHockeyStatistics}
      title={'Canadian Men’s National Ice Hockey Team\n at the World Championships'}
      customizePoint={customizePoint}
    >
      <CommonSeriesSettings
        argumentField="year"
        valueField="place"
        type="spline"
      >
        <Point visible={false} />
      </CommonSeriesSettings>
      <Series color="#888888" />
      <ArgumentAxis
        allowDecimals={false}
        axisDivisionFactor={60}
      >
        <Grid visible={true} />
        <Label>
          <Format type="decimal" />
        </Label>
      </ArgumentAxis>
      <ValueAxis inverted={true}>
        <Grid visible={false} />
        <Label customizeText={customizeText} />
      </ValueAxis>
      <Export
        enabled={true}
        formats={exportFormats}
      />
      <Legend visible={false} />
    </Chart>
  );
}

export default App;

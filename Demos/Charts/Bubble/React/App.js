import React from 'react';

import {
  Chart,
  Series,
  CommonSeriesSettings,
  Legend,
  ValueAxis,
  ArgumentAxis,
  Label,
  Border,
  Tooltip,
  Export
} from 'devextreme-react/chart';

import { dataSource } from './data.js';

const palette = ['#00ced1', '#008000', '#ffd700', '#ff7f50'];

export default function App() {
  return (
    <Chart
      id="chart"
      title={'Correlation between Total Population and\n Population with Age over 60'}
      palette={palette}
      onSeriesClick={seriesClick}
      dataSource={dataSource}>
      <Tooltip enabled={true} location="edge" customizeTooltip={customizeTooltip} />
      <CommonSeriesSettings type="bubble" />
      <ValueAxis title="Population with Age over 60">
        <Label customizeText={customizeText} />
      </ValueAxis>
      <ArgumentAxis title="Total Population">
        <Label customizeText={customizeText} />
      </ArgumentAxis>
      <Series
        name="Europe"
        argumentField="total1"
        valueField="older1"
        sizeField="perc1"
        tagField="tag1"
      />
      <Series
        name="Africa"
        argumentField="total2"
        valueField="older2"
        sizeField="perc2"
        tagField="tag2"
      />
      <Series
        name="Asia"
        argumentField="total3"
        valueField="older3"
        sizeField="perc3"
        tagField="tag3"
      />
      <Series
        name="North America"
        argumentField="total4"
        valueField="older4"
        sizeField="perc4"
        tagField="tag4"
      />
      <Legend
        position="inside"
        horizontalAlignment="left"
      >
        <Border visible={true} />
      </Legend>
      <Export enabled={true} />
    </Chart>
  );
}

function customizeTooltip(pointInfo) {
  return {
    text: `${pointInfo.point.tag}<br/>Total Population: ${pointInfo.argumentText}M<br/>Population with Age over 60: ${pointInfo.valueText}M (${pointInfo.size}%)`
  };
}

function seriesClick(e) {
  const series = e.target;
  if (series.isVisible()) {
    series.hide();
  } else {
    series.show();
  }
}

function customizeText(e) {
  return `${e.value}M`;
}

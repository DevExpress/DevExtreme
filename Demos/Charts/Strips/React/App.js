import React from 'react';

import {
  Chart,
  Series,
  Strip,
  StripStyle,
  Legend,
  ValueAxis,
  Label,
  Font,
  Export
} from 'devextreme-react/chart';
import { temperaturesData, lowAverage, highAverage } from './data.js';

const highAverageColor = '#ff9b52';
const lowAverageColor = '#6199e6';

function customizePoint(arg) {
  if (arg.value > highAverage) {
    return { color: highAverageColor };
  } else if (arg.value < lowAverage) {
    return { color: lowAverageColor };
  }
}

function customizeLabel(arg) {
  if (arg.value > highAverage) {
    return getLabelsSettings(highAverageColor);
  } else if (arg.value < lowAverage) {
    return getLabelsSettings(lowAverageColor);
  }
}

function getLabelsSettings(backgroundColor) {
  return {
    visible: true,
    backgroundColor: backgroundColor,
    customizeText
  };
}

function customizeText(arg) {
  return `${arg.valueText}&#176F`;
}

export default function App() {
  return (
    <Chart
      id="chart"
      title="Temperature in September"
      dataSource={temperaturesData}
      customizePoint={customizePoint}
      customizeLabel={customizeLabel}
    >
      <Series
        argumentField="day"
        valueField="temperature"
        type="spline"
        color="#a3aaaa"
      />
      <ValueAxis>
        <Label customizeText={customizeText} />
        <Strip startValue={highAverage} color="rgba(255,155,85,0.15)">
          <Label text="Above average">
            <Font color={highAverageColor} />
          </Label>
        </Strip>
        <Strip endValue={lowAverage} color="rgba(97,153,230,0.10)">
          <Label text="Below average">
            <Font color={lowAverageColor} />
          </Label>
        </Strip>
        <StripStyle>
          <Label>
            <Font weight="500" size="14" />
          </Label>
        </StripStyle>
      </ValueAxis>
      <Legend visible={false} />
      <Export enabled />
    </Chart>
  );
}

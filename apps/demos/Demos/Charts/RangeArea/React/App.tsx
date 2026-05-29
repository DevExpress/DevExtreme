import React from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  ArgumentAxis,
  ValueAxis,
  Label,
  VisualRange,
  Format,
  Export,
  Legend,
} from 'devextreme-react/chart';
import { inflationData } from './data.ts';

function customizeLabelText({ valueText }: { valueText: string }): string {
  return `${valueText} %`;
}

function App() {
  return (
    <Chart
      id="chart"
      dataSource={inflationData}
      palette="Violet"
      title="Annual Inflation Rate in 2024 and 2025"
    >
      <CommonSeriesSettings
        argumentField="date"
        type="rangearea"
      />
      <Series
        rangeValue1Field="val2024"
        rangeValue2Field="val2025"
        name="2024 - 2025"
      />

      <ArgumentAxis valueMarginsEnabled={false}>
        <Label format="month" />
      </ArgumentAxis>
      <ValueAxis
        tickInterval={0.5}
        valueMarginsEnabled={false}
      >
        <VisualRange
          startValue={0.5}
          endValue={4}
        />
        <Label customizeText={customizeLabelText}>
          <Format
            precision={2}
            type="fixedPoint"
          />
        </Label>
      </ValueAxis>

      <Export enabled={true} />
      <Legend visible={false} />
    </Chart>
  );
}

export default App;

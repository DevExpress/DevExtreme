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
  Legend
} from 'devextreme-react/chart';
import { inflationData } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Chart
        id="chart"
        dataSource={inflationData}
        palette="Violet"
        title="Annual Inflation Rate in 2010 and 2011"
      >
        <CommonSeriesSettings
          argumentField="date"
          type="rangearea"
        />
        <Series
          rangeValue1Field="val2010"
          rangeValue2Field="val2011"
          name="2010 - 2011"
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
}

function customizeLabelText({ valueText }) {
  return `${valueText} %`;
}

export default App;

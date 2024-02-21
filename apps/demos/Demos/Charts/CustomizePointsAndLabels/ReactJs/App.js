import React, { useCallback } from 'react';
import {
  Chart,
  Series,
  Legend,
  ValueAxis,
  VisualRange,
  Label,
  ConstantLine,
  Export,
} from 'devextreme-react/chart';
import { temperaturesData } from './data.js';

const highAverage = 77;
const lowAverage = 58;
function customizeText(arg) {
  return `${arg.valueText}&#176F`;
}
function App() {
  const customizePoint = useCallback((arg) => {
    if (arg.value > highAverage) {
      return { color: '#ff7c7c', hoverStyle: { color: '#ff7c7c' } };
    }
    if (arg.value < lowAverage) {
      return { color: '#8c8cff', hoverStyle: { color: '#8c8cff' } };
    }
    return null;
  }, []);
  const customizeLabel = useCallback((arg) => {
    if (arg.value > highAverage) {
      return {
        visible: true,
        backgroundColor: '#ff7c7c',
        customizeText(e) {
          return `${e.valueText}&#176F`;
        },
      };
    }
    return null;
  }, []);
  return (
    <Chart
      id="chart"
      title="Daily Temperature in May"
      dataSource={temperaturesData}
      customizePoint={customizePoint}
      customizeLabel={customizeLabel}
    >
      <Series
        argumentField="day"
        valueField="value"
        type="bar"
        color="#e7d19a"
      />
      <ValueAxis maxValueMargin={0.01}>
        <VisualRange startValue={40} />
        <Label customizeText={customizeText} />
        <ConstantLine
          width={2}
          value={lowAverage}
          color="#8c8cff"
          dashStyle="dash"
        >
          <Label text="Low Average" />
        </ConstantLine>
        <ConstantLine
          width={2}
          value={highAverage}
          color="#ff7c7c"
          dashStyle="dash"
        >
          <Label text="High Average" />
        </ConstantLine>
      </ValueAxis>
      <Legend visible={false} />
      <Export enabled={true} />
    </Chart>
  );
}
export default App;

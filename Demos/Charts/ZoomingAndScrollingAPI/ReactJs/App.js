import React from 'react';
import Chart, {
  Series,
  Legend,
  CommonSeriesSettings,
  Point,
  ArgumentAxis,
} from 'devextreme-react/chart';
import RangeSelector, {
  Size,
  Chart as ChartOptions,
  Margin,
  Scale,
  Behavior,
} from 'devextreme-react/range-selector';
import { zoomingData } from './data.js';

function App() {
  const [visualRange, setVisualRange] = React.useState({ startValue: 10, endValue: 880 });
  const updateVisualRange = React.useCallback(
    (e) => {
      setVisualRange(e.value);
    },
    [setVisualRange],
  );
  return (
    <React.Fragment>
      <Chart
        id="zoomedChart"
        palette="Harmony Light"
        dataSource={zoomingData}
      >
        <Series
          argumentField="arg"
          valueField="y1"
        />
        <Series
          argumentField="arg"
          valueField="y2"
        />
        <Series
          argumentField="arg"
          valueField="y3"
        />
        <ArgumentAxis visualRange={visualRange} />
        <Legend visible={false} />
        <CommonSeriesSettings>
          <Point size={7} />
        </CommonSeriesSettings>
      </Chart>
      <RangeSelector
        dataSource={zoomingData}
        onValueChanged={updateVisualRange}
      >
        <Size height={120} />
        <Margin left={10} />
        <Scale
          minorTickCount={1}
          startValue={10}
          endValue={880}
        />
        <ChartOptions palette="Harmony Light">
          <Behavior valueChangeMode="onHandleMove" />
          <Legend visible={false} />
          <Series
            argumentField="arg"
            valueField="y1"
          />
          <Series
            argumentField="arg"
            valueField="y2"
          />
          <Series
            argumentField="arg"
            valueField="y3"
          />
        </ChartOptions>
      </RangeSelector>
    </React.Fragment>
  );
}
export default App;

import React, { useCallback, useState } from 'react';
import Chart, {
  Series,
  Aggregation,
  ArgumentAxis,
  Grid,
  Label,
  ValueAxis,
  Margin,
  Legend,
  Tooltip,
} from 'devextreme-react/chart';
import RangeSelector, {
  Size,
  Scale,
  Chart as RsChart,
  ValueAxis as RsValueAxis,
  Series as RsSeries,
  Aggregation as RsAggregation,
  Behavior,
} from 'devextreme-react/range-selector';
import { dataSource } from './data.js';

function App() {
  const [visualRange, setVisualRange] = useState({});
  const updateVisualRange = useCallback(
    (e) => {
      setVisualRange(e.value);
    },
    [setVisualRange],
  );
  return (
    <div id="chart-demo">
      <Chart
        id="zoomedChart"
        dataSource={dataSource}
        title="Google Inc. Stock Prices"
      >
        <Series
          type="candlestick"
          openValueField="Open"
          highValueField="High"
          lowValueField="Low"
          closeValueField="Close"
          argumentField="Date"
        >
          <Aggregation enabled={true} />
        </Series>
        <ArgumentAxis
          visualRange={visualRange}
          valueMarginsEnabled={false}
          argumentType="datetime"
        >
          <Grid visible={true} />
          <Label visible={false} />
        </ArgumentAxis>
        <ValueAxis valueType="numeric" />
        <Margin right={10} />
        <Legend visible={false} />
        <Tooltip enabled={true} />
      </Chart>
      <RangeSelector
        dataSource={dataSource}
        onValueChanged={updateVisualRange}
      >
        <Size height={120} />
        <RsChart>
          <RsValueAxis valueType="numeric" />
          <RsSeries
            type="line"
            valueField="Open"
            argumentField="Date"
          >
            <RsAggregation enabled={true} />
          </RsSeries>
        </RsChart>
        <Scale
          placeholderHeight={20}
          minorTickInterval="day"
          tickInterval="month"
          valueType="datetime"
          aggregationInterval="week"
        />
        <Behavior
          snapToTicks={false}
          valueChangeMode="onHandleMove"
        />
      </RangeSelector>
    </div>
  );
}
export default App;

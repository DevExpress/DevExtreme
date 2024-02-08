import React, { useCallback, useState } from 'react';

import PolarChart, {
  CommonSeriesSettings,
  Series,
  Point,
  ArgumentAxis,
  ValueAxis,
  Export,
  Legend,
} from 'devextreme-react/polar-chart';

import RangeSelector, {
  Size,
  Margin,
  Scale,
  MinorTick,
  Behavior,
  RangeSelectorTypes,
} from 'devextreme-react/range-selector';

import { VisualRange } from 'devextreme-react/common/charts';
import { dataSource } from './data.ts';

function App() {
  const [visualRange, setVisualRange] = useState<VisualRange>({ startValue: 0, endValue: 8 });

  const updateVisualRange = useCallback((e: RangeSelectorTypes.ValueChangedEvent) => {
    setVisualRange(e.value);
  }, [setVisualRange]);

  return (
    <React.Fragment>
      <PolarChart
        id="zoomedChart"
        dataSource={dataSource}
        title="Stochastic Process"
      >
        <CommonSeriesSettings
          argumentField="argument"
          closed={false}
        />
        <Series
          type="scatter"
          name="Test results"
          valueField="value"
        >
          <Point size={8} />
        </Series>
        <Series
          type="line"
          name="Expected average"
          valueField="originalValue"
        >
          <Point visible={false} />
        </Series>
        <ArgumentAxis
          startAngle={90}
          tickInterval={30}
        />
        <ValueAxis visualRange={visualRange} />
        <Export enabled={true} />
        <Legend
          hoverMode="excludePoints"
          verticalAlignment="top"
          horizontalAlignment="center"
        />
      </PolarChart>
      <RangeSelector
        onValueChanged={updateVisualRange}
      >
        <Size height={100} />
        <Margin
          top={10}
          left={60}
          bottom={10}
          right={50}
        />
        <Scale
          startValue={0}
          endValue={8}
          minorTickInterval={0.1}
          tickInterval={1}
        >
          <MinorTick visible={false} />
        </Scale>
        <Behavior valueChangeMode="onHandleMove" />
      </RangeSelector>
    </React.Fragment>
  );
}

export default App;

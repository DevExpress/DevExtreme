import React, { useCallback, useState } from 'react';

import Chart, {
  ArgumentAxis, Grid, Label, Legend, MinorGrid, Series,
} from 'devextreme-react/chart';
import RangeSelector, {
  Behavior, Chart as RsChart, Label as RsLabel, Scale, Series as RsSeries, SliderMarker,
} from 'devextreme-react/range-selector';

import { dataSource } from './data.ts';

const App = () => {
  const [range, setRange] = useState<(number | Date | string)[]>([]);

  const updateRange = useCallback((data: { value: (number | Date | string)[] }) => {
    setRange(data.value);
  }, []);

  return (
    <>
      <Chart
        id="zoomed-chart"
        dataSource={dataSource}
        resizePanesOnZoom={true}
      >
        <Series />
        <ArgumentAxis
          visualRange={range}
          valueMarginsEnabled={false}
          minorTickCount={10}
          type="logarithmic"
        >
          <Label format="exponential" />
          <Grid visible={true} />
          <MinorGrid visible={true} />
        </ArgumentAxis>
        <Legend visible={false} />
      </Chart>
      <RangeSelector
        id="range-selector"
        dataSource={dataSource}
        onValueChanged={updateRange}
      >
        <RsChart>
          <RsSeries />
        </RsChart>
        <Scale minRange={1} minorTickCount={10} type="logarithmic">
          <RsLabel format="exponential" />
        </Scale>
        <SliderMarker format="exponential" />
        <Behavior snapToTicks={false} valueChangeMode="onHandleMove" />
      </RangeSelector>
    </>
  );
};

export default App;

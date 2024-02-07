import React, { useCallback, useState } from 'react';
import RangeSelector, {
  Chart as RsChart,
  Series as RsSeries,
  Scale,
  Label as RsLabel,
  SliderMarker,
  Behavior,
} from 'devextreme-react/range-selector';
import Chart, {
  ArgumentAxis,
  Legend,
  Series,
  Label,
  Grid,
  MinorGrid,
} from 'devextreme-react/chart';
import { dataSource } from './data.js';

const App = () => {
  const [range, setRange] = useState([]);
  const updateRange = useCallback(
    (data) => {
      setRange(data.value);
    },
    [setRange],
  );
  return (
    <React.Fragment>
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
        <Scale
          minRange={1}
          minorTickCount={10}
          type="logarithmic"
        >
          <RsLabel format="exponential" />
        </Scale>
        <SliderMarker format="exponential" />
        <Behavior
          snapToTicks={false}
          valueChangeMode="onHandleMove"
        />
      </RangeSelector>
    </React.Fragment>
  );
};
export default App;

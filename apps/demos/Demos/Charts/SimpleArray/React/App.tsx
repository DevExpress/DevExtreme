import React from 'react';
import Chart, {
  ArgumentAxis,
  Label,
  Legend,
  Series,
} from 'devextreme-react/chart';
import { populationData } from './data.ts';

function App() {
  return (
    <Chart
      title="World Population by Decade"
      dataSource={populationData}
      id="chart"
    >
      <ArgumentAxis tickInterval={10}>
        <Label format="decimal" />
      </ArgumentAxis>

      <Series
        type="bar"
      />

      <Legend
        visible={false}
      />
    </Chart>
  );
}

export default App;

import React from 'react';
import Chart, {
  ValueAxis,
  Label,
  Legend,
  ArgumentAxis,
  CommonSeriesSettings,
  Border,
  Series,
} from 'devextreme-react/chart';
import RangeSelector, {
  Size,
  Chart as ChartOptions,
  Margin,
  Scale,
  Behavior,
  CommonSeriesSettings as CommonSeriesSettingsOptions,
  Series as RsChartSeries,
} from 'devextreme-react/range-selector';
import { series, dataSource } from './data.js';

const seriesList = series.map((item) => <Series
  valueField={item.valueField}
  name={item.name}
  key={item.name} />);

const rsChartSeriesList = series.map((item) => <RsChartSeries
  valueField={item.valueField}
  name={item.name}
  key={item.name} />);

function formatValueAxisLabel(e) {
  return `${e.valueText}%`;
}

function App() {
  const [visualRange, setVisualRange] = React.useState({ startValue: 'Inner Core', endValue: 'Upper Crust' });

  const updateVisualRange = React.useCallback((e) => {
    setVisualRange(e.value);
  }, [setVisualRange]);

  return (
    <React.Fragment>
      <Chart
        id="zoomedChart"
        palette="Soft"
        title="The Chemical Composition of the Earth Layers"
        dataSource={dataSource}
      >
        {seriesList}
        <ValueAxis>
          <Label customizeText={formatValueAxisLabel} />
        </ValueAxis>
        <ArgumentAxis visualRange={visualRange} />
        <CommonSeriesSettings type="bar" ignoreEmptyPoints={true} />
        <Legend visible={true}
          verticalAlignment="top"
          horizontalAlignment="right"
          orientation="horizontal"
        >
          <Border visible={true} />
        </Legend>
      </Chart>
      <RangeSelector
        dataSource={dataSource}
        onValueChanged={updateVisualRange}
      >
        <Size height={120} />
        <Margin left={10} />
        <Scale minorTickCount={1} startValue="Inner Core" endValue="Upper Crust" />
        <Behavior valueChangeMode="onHandleMove" />

        <ChartOptions palette="Soft">
          {rsChartSeriesList}
          <Legend visible={false} />
          <CommonSeriesSettingsOptions type="bar" ignoreEmptyPoints ={true} />
        </ChartOptions>
      </RangeSelector>
    </React.Fragment>
  );
}

export default App;

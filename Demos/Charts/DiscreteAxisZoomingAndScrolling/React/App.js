import React from 'react';
import { series, dataSource } from './data.js';

import Chart, {
  ValueAxis,
  Label,
  Legend,
  ArgumentAxis,
  CommonSeriesSettings,
  Border,
  Series
} from 'devextreme-react/chart';

import RangeSelector, {
  Size,
  Chart as ChartOptions,
  Margin,
  Scale,
  Behavior,
  CommonSeriesSettings as CommonSeriesSettingsOptions,
  Series as RsChartSeries
} from 'devextreme-react/range-selector';

const seriesList = series.map(item =>
  <Series valueField={item.valueField} name={item.name} key={item.name} />
);

const rsChartSeriesList = series.map(item =>
  <RsChartSeries valueField={item.valueField} name={item.name} key={item.name} />
);

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visualRange: { startValue: 'Inner Core', endValue: 'Upper Crust' }
    };

    this.updateVisualRange = this.updateVisualRange.bind(this);
  }

  render() {
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
          <ArgumentAxis visualRange={this.state.visualRange} />
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
          onValueChanged={this.updateVisualRange }
        >
          <Size height={120} />
          <Margin left={10} />
          <Scale minorTickCount={1} startValue="Inner Core" endValue="Upper Crust" />
          <Behavior callValueChanged="onMoving" />

          <ChartOptions palette="Soft">
            {rsChartSeriesList}
            <Legend visible={false} />
            <CommonSeriesSettingsOptions type="bar" ignoreEmptyPoints ={true} />
          </ChartOptions>
        </RangeSelector>
      </React.Fragment>
    );
  }

  updateVisualRange(e) {
    this.setState({ visualRange: e.value });
  }
}

function formatValueAxisLabel() {
  return `${this.valueText}%`;
}

export default App;

import React from 'react';

import Chart, {
  ArgumentAxis,
  ValueAxis,
  CommonSeriesSettings,
  SeriesTemplate,
  Point,
  Tooltip,
  Label,
  ZoomAndPan,
  Crosshair,
  Legend,
  Border
} from 'devextreme-react/chart';

import Button from 'devextreme-react/button';

import { birthLife } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();

    this.resetZoom = () => {
      this.chart.resetVisualRange();
    };

  }

  render() {
    return (
      <div>
        <Chart
          title="Life Expectancy vs. Birth Rates"
          dataSource={birthLife}
          ref={this.chartRef}
          id="chart">
          <ArgumentAxis title="Life Expectancy" />
          <ValueAxis title="Birth Rate" />
          <SeriesTemplate
            nameField="year" />
          <CommonSeriesSettings
            type="scatter"
            argumentField="life_exp"
            valueField="birth_rate">
            <Point size={8} />
          </CommonSeriesSettings>
          <ZoomAndPan
            valueAxis="both"
            argumentAxis="both"
            dragToZoom={true}
            allowMouseWheel={true}
            panKey="shift" />
          <Crosshair
            enabled={true}>
            <Label visible={true} />
          </Crosshair>
          <Tooltip
            enabled={true}
            customizeTooltip={customizeTooltip}
          ></Tooltip>
          <Legend
            position="inside">
            <Border visible={true} />
          </Legend>
        </Chart>
        <Button
          id="reset-zoom"
          text="Reset"
          onClick={this.resetZoom}
        ></Button>
      </div>
    );
  }

  get chart() {
    return this.chartRef.current.instance;
  }
}

function customizeTooltip(pointInfo) {
  const data = pointInfo.point.data;
  return {
    text: `${data.country} ${data.year}`
  };
}

export default App;

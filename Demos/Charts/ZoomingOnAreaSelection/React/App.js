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
  Border,
} from 'devextreme-react/chart';
import Button from 'devextreme-react/button';
import { birthLife } from './data.js';

function customizeTooltip(pointInfo) {
  const { data } = pointInfo.point;
  return {
    text: `${data.country} ${data.year}`,
  };
}

function App() {
  const chartRef = React.useRef(null);

  const resetZoom = React.useCallback(() => {
    chartRef.current.instance.resetVisualRange();
  }, []);

  return (
    <div>
      <Chart
        title="Life Expectancy vs. Birth Rates"
        dataSource={birthLife}
        ref={chartRef}
        id="chart"
      >
        <ArgumentAxis title="Life Expectancy" />
        <ValueAxis title="Birth Rate" />
        <SeriesTemplate nameField="year" />
        <CommonSeriesSettings
          type="scatter"
          argumentField="life_exp"
          valueField="birth_rate"
        >
          <Point size={8} />
        </CommonSeriesSettings>
        <ZoomAndPan
          valueAxis="both"
          argumentAxis="both"
          dragToZoom={true}
          allowMouseWheel={true}
          panKey="shift"
        />
        <Crosshair enabled={true}>
          <Label visible={true} />
        </Crosshair>
        <Tooltip
          enabled={true}
          customizeTooltip={customizeTooltip}
        ></Tooltip>
        <Legend position="inside">
          <Border visible={true} />
        </Legend>
      </Chart>
      <Button id="reset-zoom" text="Reset" onClick={resetZoom}></Button>
    </div>
  );
}

export default App;

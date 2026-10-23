import React, { useCallback, useState } from 'react';
import Chart, {
  Title,
  Subtitle,
  CommonSeriesSettings,
  SeriesTemplate,
  Aggregation,
  Tooltip,
  Format,
} from 'devextreme-react/chart';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import type { ChartTypes } from 'devextreme-react/chart';
import { MAX_SUFFIX, oilProductionData } from './data.ts';

const aggregationFunctions = [
  { displayName: 'Average', func: 'avg' },
  { displayName: 'Sum', func: 'sum' },
  { displayName: 'Minimum', func: 'min' },
];
const methodInputAttr = { 'aria-label': 'Method' };
const maxSeriesColor = '#d3d3d3';

const customizeSeries = (seriesName: string) => {
  const isMaxSeries = seriesName.endsWith(MAX_SUFFIX);
  const year = isMaxSeries ? seriesName.slice(0, -MAX_SUFFIX.length) : seriesName;

  return {
    barOverlapGroup: year,
    ...(isMaxSeries && {
      aggregation: { enabled: true, method: 'max' as ChartTypes.ChartSeriesAggregationMethod },
      color: maxSeriesColor,
      showInLegend: false,
    }),
  };
};

const customizeTooltip = ({
  argumentText, seriesName, valueText, point,
}: ChartTypes.CommonPointInfo): Record<string, string> => {
  const month: string | undefined = point?.data?.month;

  return {
    text: `<b>${argumentText}</b><br/>${seriesName}${month ? ` (${month})` : ''}: ${valueText}`,
  };
};

function App() {
  const [useAggregation, setUseAggregation] = useState(true);
  const [currentFunction, setCurrentFunction] = useState<ChartTypes.ChartSeriesAggregationMethod>('avg');
  const updateAggregationUsage = useCallback(({ value }: { value?: boolean }) => {
    if (value !== undefined) {
      setUseAggregation(value);
    }
  }, []);
  const updateMethod = useCallback(({ value }: { value?: ChartTypes.ChartSeriesAggregationMethod }) => {
    if (value !== undefined) {
      setCurrentFunction(value);
    }
  }, []);

  return (
    <div id="chart-demo">
      <Chart id="chart" dataSource={oilProductionData}>
        <Title text="Production of Crude Oil">
          <Subtitle text="(in Barrels)"></Subtitle>
        </Title>
        <CommonSeriesSettings argumentField="state" valueField="value" type="bar">
          <Aggregation enabled={useAggregation} method={currentFunction}></Aggregation>
        </CommonSeriesSettings>
        <SeriesTemplate nameField="series" customizeSeries={customizeSeries}></SeriesTemplate>
        <Tooltip enabled={true} customizeTooltip={customizeTooltip}>
          <Format type="millions" precision={1} />
        </Tooltip>
      </Chart>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            value={useAggregation}
            onValueChanged={updateAggregationUsage}
            text="Aggregation enabled"
          />
        </div>
        <div className="option">
          <span>Method:</span>&nbsp;
          <SelectBox
            dataSource={aggregationFunctions}
            value={currentFunction}
            disabled={!useAggregation}
            onValueChanged={updateMethod}
            displayExpr="displayName"
            valueExpr="func"
            inputAttr={methodInputAttr}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useCallback, useState } from 'react';
import Chart, {
  Title,
  Subtitle,
  CommonSeriesSettings,
  SeriesTemplate,
  Aggregation,
} from 'devextreme-react/chart';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import { oilProductionData } from './data.js';

const aggregationFunctions = [
  { displayName: 'Average', func: 'avg' },
  { displayName: 'Maximum', func: 'max' },
  { displayName: 'Minimum', func: 'min' },
];
const methodInputAttr = { 'aria-label': 'Method' };
const ghostBarColor = '#d3d3d3';
const customizeSeries = (seriesName) => {
  const isGhost = seriesName.endsWith(' (max)');
  const year = isGhost ? seriesName.slice(0, -6) : seriesName;
  return {
    barOverlapGroup: year,
    ...(isGhost && {
      aggregation: { enabled: true, method: 'max' },
      color: ghostBarColor,
      name: `${year} max`,
      showInLegend: false,
    }),
  };
};
function App() {
  const [useAggregation, setUseAggregation] = useState(true);
  const [currentFunction, setCurrentFunction] = useState('avg');
  const updateAggregationUsage = useCallback(({ value }) => {
    if (value !== undefined) {
      setUseAggregation(value);
    }
  }, []);
  const updateMethod = useCallback(({ value }) => {
    if (value !== undefined) {
      setCurrentFunction(value);
    }
  }, []);
  return (
    <div id="chart-demo">
      <Chart
        id="chart"
        dataSource={oilProductionData}
      >
        <Title text="Production of Crude Oil">
          <Subtitle text="(in Barrels)"></Subtitle>
        </Title>
        <CommonSeriesSettings
          argumentField="state"
          valueField="value"
          type="bar"
        >
          <Aggregation
            enabled={useAggregation}
            method={currentFunction}
          ></Aggregation>
        </CommonSeriesSettings>
        <SeriesTemplate
          nameField="year"
          customizeSeries={customizeSeries}
        ></SeriesTemplate>
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

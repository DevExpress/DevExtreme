import React, { useCallback, useState } from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  Aggregation,
  Point,
  ArgumentAxis,
  ValueAxis,
  Title,
  Font,
  Legend,
  Label,
  Tooltip,
  IAggregationProps,
} from 'devextreme-react/chart';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import {
  weatherData, aggregationFunctions, aggregationIntervals, functionLabel, intervalLabel,
} from './data.ts';

const customizeTooltip = (pointInfo) => {
  const { aggregationInfo } = pointInfo.point;
  const start: Date = aggregationInfo && aggregationInfo.intervalStart;
  const end: Date = aggregationInfo && aggregationInfo.intervalEnd;
  const handlers = {
    'Average temperature': (arg: { argument: Date; value: number; }) => ({
      text: `${(!aggregationInfo
        ? `Date: ${arg.argument.toDateString()}`
        : `Interval: ${start.toDateString()} - ${end.toDateString()}`)
      }<br/>Temperature: ${arg.value.toFixed(2)} °C`,
    }),
    'Temperature range': (arg: { rangeValue1: number; rangeValue2: number; }) => ({
      text: `Interval: ${start.toDateString()
      } - ${end.toDateString()
      }<br/>Temperature range: ${arg.rangeValue1
      } - ${arg.rangeValue2} °C`,
    }),
    Precipitation: (arg: { argument: Date; valueText: string; }) => ({
      text: `Date: ${arg.argument.toDateString()
      }<br/>Precipitation: ${arg.valueText} mm`,
    }),
  };

  return handlers[pointInfo.seriesName](pointInfo);
};

function App() {
  const [useAggregation, setUseAggregation] = useState(true);
  const [currentFunction, setCurrentFunction] = useState(aggregationFunctions[0].func);
  const [currentInterval, setCurrentInterval] = useState(aggregationIntervals[0].interval);

  const updateAggregationUsage = useCallback(({ value }) => {
    setUseAggregation(value);
  }, [setUseAggregation]);

  const updateInterval = useCallback(({ value }) => {
    setCurrentInterval(value);
  }, [setCurrentInterval]);

  const updateMethod = useCallback(({ value }) => {
    setCurrentFunction(value);
  }, [setCurrentFunction]);

  const calculateRangeArea = useCallback<IAggregationProps['calculate']>((aggregationInfo) => {
    if (!aggregationInfo.data.length) {
      return null;
    }

    const temp = aggregationInfo.data.map((item: { temp: number; }) => item.temp);
    return {
      date: new Date((aggregationInfo.intervalStart.valueOf()
        + aggregationInfo.intervalEnd.valueOf()) / 2),
      maxTemp: Math.max.apply(null, temp),
      minTemp: Math.min.apply(null, temp),
    };
  }, []);

  return (
    <div id="chart-demo">
      <Chart
        id="chart"
        dataSource={weatherData}
      >
        <CommonSeriesSettings argumentField="date" />
        <Series
          axis="precipitation"
          color="#03a9f4"
          type="bar"
          valueField="precipitation"
          name="Precipitation"
        />
        <Series
          axis="temperature"
          color="#ffc0bb"
          type="rangearea"
          rangeValue1Field="minTemp"
          rangeValue2Field="maxTemp"
          name="Temperature range"
        >
          <Aggregation
            enabled={useAggregation}
            calculate={calculateRangeArea}
            method="custom"
          />
        </Series>
        <Series
          axis="temperature"
          color="#e91e63"
          valueField="temp"
          name="Average temperature"
        >
          <Point size={7} />
          <Aggregation
            enabled={useAggregation}
            method={currentFunction}
          />
        </Series>

        <ArgumentAxis
          aggregationInterval={currentInterval}
          valueMarginsEnabled={false}
          argumentType="datetime"
        />
        <ValueAxis name="temperature">
          <Title text="Temperature, °C">
            <Font color="#e91e63" />
          </Title>
          <Label>
            <Font color="#e91e63" />
          </Label>
        </ValueAxis>
        <ValueAxis
          name="precipitation"
          position="right"
        >
          <Title text="Precipitation, mm">
            <Font color="#03a9f4" />
          </Title>
          <Label>
            <Font color="#03a9f4" />
          </Label>
        </ValueAxis>

        <Legend visible={false} />
        <Tooltip
          enabled={true}
          customizeTooltip={customizeTooltip}
        />
        <Title text="Weather in Las Vegas, NV (2017)" />
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
          <span>Interval:</span>&nbsp;
          <SelectBox
            dataSource={aggregationIntervals}
            value={currentInterval}
            inputAttr={intervalLabel}
            onValueChanged={updateInterval}
            displayExpr="displayName"
            valueExpr="interval"
          />
        </div>
        <div className="option">
          <span>Method:</span>&nbsp;
          <SelectBox
            dataSource={aggregationFunctions}
            inputAttr={functionLabel}
            value={currentFunction}
            onValueChanged={updateMethod}
            displayExpr="displayName"
            valueExpr="func"
          />
        </div>
      </div>
    </div>
  );
}

export default App;

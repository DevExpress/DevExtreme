import React from 'react';
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
  Tooltip
} from 'devextreme-react/chart';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import { weatherData, aggregationFunctions, aggregationIntervals } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      useAggregation: true,
      currentFunction: aggregationFunctions[0].func,
      currentInterval: aggregationIntervals[0].interval
    };

    this.updateAggregationUsage = this.updateAggregationUsage.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.updateMethod = this.updateMethod.bind(this);
  }

  render() {
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
              enabled={this.state.useAggregation}
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
              enabled={this.state.useAggregation}
              method={this.state.currentFunction}
            />
          </Series>

          <ArgumentAxis
            aggregationInterval={this.state.currentInterval}
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
              value={this.state.useAggregation}
              onValueChanged={this.updateAggregationUsage}
              text="Aggregation enabled"
            />
          </div>
          <div className="option">
            <span>Interval:</span>&nbsp;
            <SelectBox
              dataSource={aggregationIntervals}
              value={this.state.currentInterval}
              onValueChanged={this.updateInterval}
              displayExpr="displayName"
              valueExpr="interval"
            />
          </div>
          <div className="option">
            <span>Method:</span>&nbsp;
            <SelectBox
              dataSource={aggregationFunctions}
              value={this.state.currentFunction}
              onValueChanged={this.updateMethod}
              displayExpr="displayName"
              valueExpr="func"
            />
          </div>
        </div>
      </div>
    );
  }

  updateAggregationUsage({ value }) {
    this.setState({ useAggregation: value });
  }

  updateInterval({ value }) {
    this.setState({ currentInterval: value });
  }

  updateMethod({ value }) {
    this.setState({ currentFunction: value });
  }
}

function calculateRangeArea(aggregationInfo) {
  if(!aggregationInfo.data.length) {
    return;
  }

  let temp = aggregationInfo.data.map(item => item.temp);
  return {
    date: new Date((aggregationInfo.intervalStart.valueOf() + aggregationInfo.intervalEnd.valueOf()) / 2),
    maxTemp: Math.max.apply(null, temp),
    minTemp: Math.min.apply(null, temp)
  };
}

function customizeTooltip(pointInfo) {
  const aggregationInfo = pointInfo.point.aggregationInfo;
  const start = aggregationInfo && aggregationInfo.intervalStart;
  const end = aggregationInfo && aggregationInfo.intervalEnd;
  const handlers = {
    'Average temperature': arg => {
      return {
        text: `${(!aggregationInfo ?
          `Date: ${arg.argument.toDateString()}` :
          `Interval: ${start.toDateString()} - ${end.toDateString()}`)
        }<br/>Temperature: ${arg.value.toFixed(2)} °C`
      };
    },
    'Temperature range': arg => {
      return {
        text: `Interval: ${start.toDateString()
        } - ${end.toDateString()
        }<br/>Temperature range: ${arg.rangeValue1
        } - ${arg.rangeValue2} °C`
      };
    },
    'Precipitation': arg => {
      return {
        text: `Date: ${arg.argument.toDateString()
        }<br/>Precipitation: ${arg.valueText} mm`
      };
    }
  };

  return handlers[pointInfo.seriesName](pointInfo);
}

export default App;

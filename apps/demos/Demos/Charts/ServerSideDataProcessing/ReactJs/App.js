import React from 'react';
import { DataSource } from 'devextreme-react/common/data';
import Chart, {
  ValueAxis,
  ArgumentAxis,
  CommonPaneSettings,
  Grid,
  Series,
  Label,
  Legend,
  Size,
  Border,
  Tooltip,
  Export,
  LoadingIndicator,
} from 'devextreme-react/chart';
import SelectBox from 'devextreme-react/select-box';
import { months, monthLabel } from './data.js';

const year = 2017;
let selectedMonth = 1;
const startOfMonthStr = (month) => `${month}/01/${year}`;
const endOfMonthStr = (month) => {
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const lastDay = new Date(nextYear, nextMonth - 1, 0).getDate();
  return `${month}/${lastDay}/${year}`;
};
const chartDataSource = new DataSource({
  key: 'Date',
  load: () => {
    const startVisible = startOfMonthStr(selectedMonth);
    const endVisible = endOfMonthStr(selectedMonth);
    const url =
      'https://js.devexpress.com/Demos/NetCore/api/TemperatureData' +
      `?startVisible=${encodeURIComponent(startVisible)}` +
      `&endVisible=${encodeURIComponent(endVisible)}` +
      `&startBound=${encodeURIComponent(startVisible)}` +
      `&endBound=${encodeURIComponent(endVisible)}`;
    return fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Network response fails: ${r.status}`);
        return r.json();
      })
      .then((arr) =>
        arr.map((item) => ({
          ...item,
          Temperature: (item.MinTemp + item.MaxTemp) / 2,
          Date: new Date(item.Date),
        })),
      );
  },
  paginate: false,
});
function onValueChanged(data) {
  selectedMonth = data.value;
  chartDataSource.load();
}
function customizeLabel(e) {
  return `${e.valueText}${'&#176C'}`;
}
function customizeArgumentAxisLabel(e) {
  return new Date(e.value).getDate().toString();
}
function customizeTooltip(arg) {
  return {
    text: `${arg.valueText}${'&#176C'}`,
  };
}
function App() {
  return (
    <div id="chart-demo">
      <Chart
        title={`Temperature in Seattle, ${year}`}
        dataSource={chartDataSource}
      >
        <Size height={420} />
        <ValueAxis valueType="numeric">
          <Grid opacity={0.2} />
          <Label customizeText={customizeLabel} />
        </ValueAxis>
        <ArgumentAxis type="discrete">
          <Grid
            visible={true}
            opacity={0.5}
          />
          <Label customizeText={customizeArgumentAxisLabel} />
        </ArgumentAxis>
        <CommonPaneSettings>
          <Border
            visible={true}
            width={2}
            top={false}
            right={false}
          />
        </CommonPaneSettings>
        <Series
          argumentField="Date"
          valueField="Temperature"
          type="spline"
        />
        <Legend visible={false} />
        <Export enabled={true} />
        <Tooltip
          enabled={true}
          customizeTooltip={customizeTooltip}
        />
        <LoadingIndicator enabled={true} />
      </Chart>

      <div className="action">
        <div className="label">Choose a month:</div>
        <SelectBox
          id="selectbox"
          width={150}
          valueExpr="id"
          inputAttr={monthLabel}
          displayExpr="name"
          items={months}
          defaultValue={selectedMonth}
          onValueChanged={onValueChanged}
        />
      </div>
    </div>
  );
}
export default App;

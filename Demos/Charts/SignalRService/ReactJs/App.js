import React from 'react';
import Chart, {
  ArgumentAxis,
  ValueAxis,
  Aggregation,
  Legend,
  Series,
  ScrollBar,
  ZoomAndPan,
  LoadingIndicator,
  Pane,
  Tooltip,
  Crosshair,
  Margin,
  HorizontalLine,
} from 'devextreme-react/chart';
import CustomStore from 'devextreme/data/custom_store';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import TooltipTemplate from './TooltipTemplate.js';

const minVisualRangeLength = { minutes: 10 };
const defaultVisualRange = { length: 'hour' };
function App() {
  const [dataSource, setDataSource] = React.useState(null);
  const chartRef = React.useRef(null);
  const customizePoint = React.useCallback((arg) => {
    if (arg.seriesName === 'Volume') {
      const point = chartRef.current.instance
        .getAllSeries()[0]
        .getPointsByArg(arg.argument)[0].data;
      if (point && point.close >= point.open) {
        return { color: '#1db2f5' };
      }
    }
    return null;
  }, []);
  const calculateCandle = React.useCallback((e) => {
    const prices = e.data.map((d) => d.price);
    if (prices.length) {
      return {
        date: new Date((e.intervalStart.valueOf() + e.intervalEnd.valueOf()) / 2),
        open: prices[0],
        high: Math.max.apply(null, prices),
        low: Math.min.apply(null, prices),
        close: prices[prices.length - 1],
      };
    }
    return null;
  }, []);
  React.useEffect(() => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl('https://js.devexpress.com/Demos/NetCore/stockTickDataHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();
    const store = new CustomStore({
      load: () => hubConnection.invoke('getAllData'),
      key: 'date',
    });
    hubConnection.start().then(() => {
      hubConnection.on('updateStockPrice', (data) => {
        store.push([{ type: 'insert', key: data.date, data }]);
      });
      setDataSource(store);
    });
  }, []);
  return (
    <div>
      <Chart
        id="chart"
        ref={chartRef}
        dataSource={dataSource}
        title="Stock Price"
        customizePoint={customizePoint}
      >
        <Margin right={30} />
        <Series
          pane="Price"
          argumentField="date"
          type="candlestick"
        >
          <Aggregation
            enabled={true}
            method="custom"
            calculate={calculateCandle}
          />
        </Series>
        <Series
          pane="Volume"
          name="Volume"
          argumentField="date"
          valueField="volume"
          color="red"
          type="bar"
        >
          <Aggregation
            enabled={true}
            method="sum"
          />
        </Series>
        <Pane name="Price"></Pane>
        <Pane
          name="Volume"
          height={80}
        ></Pane>
        <Legend visible={false} />
        <ArgumentAxis
          argumentType="datetime"
          minVisualRangeLength={minVisualRangeLength}
          defaultVisualRange={defaultVisualRange}
        />
        <ValueAxis placeholderSize={50} />
        <ZoomAndPan argumentAxis="both" />
        <ScrollBar visible={true} />
        <LoadingIndicator enabled={true} />
        <Tooltip
          enabled={true}
          shared={true}
          argumentFormat="shortDateShortTime"
          contentRender={TooltipTemplate}
        />
        <Crosshair enabled={true}>
          <HorizontalLine visible={false} />
        </Crosshair>
      </Chart>
    </div>
  );
}
export default App;

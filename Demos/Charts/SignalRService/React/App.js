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
  Crosshair
} from 'devextreme-react/chart';
import CustomStore from 'devextreme/data/custom_store';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import TooltipTemplate from './TooltipTemplate.js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { dataSource: null };

    const hubConnection = new HubConnectionBuilder()
      .withUrl('https://js.devexpress.com/Demos/NetCore/stockTickDataHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .build();

    const store = new CustomStore({
      load: () => hubConnection.invoke('getAllData'),
      key: 'date'
    });

    hubConnection
      .start()
      .then(() => {
        hubConnection.on('updateStockPrice', (data) => {
          store.push([{ type: 'insert', key: data.date, data: data }]);
        });
        this.setState({ dataSource: store });
      });

    this.customizePoint = this.customizePoint.bind(this);
    this.storeChartRef = (ref) => { this.chartRef = ref; };
  }

  calculateCandle(e) {
    const prices = e.data.map(d => d.price);
    if (prices.length) {
      return {
        date: new Date((e.intervalStart.valueOf() + e.intervalEnd.valueOf()) / 2),
        open: prices[0],
        high: Math.max.apply(null, prices),
        low: Math.min.apply(null, prices),
        close: prices[prices.length - 1]
      };
    }
  }

  render() {
    return (
      <div>
        <Chart
          id="chart"
          ref={this.storeChartRef}
          dataSource={this.state.dataSource}
          margin={{ right: 30 }}
          title="Stock Price"
          customizePoint={this.customizePoint}>
          <Series
            pane="Price"
            argumentField="date"
            type="CandleStick">
            <Aggregation
              enabled={true}
              method="custom"
              calculate={this.calculateCandle} />
          </Series>
          <Series
            pane="Volume"
            name="Volume"
            argumentField="date"
            valueField="volume"
            color="red"
            type="bar">
            <Aggregation
              enabled={true}
              method="sum" />
          </Series>
          <Pane name="Price"></Pane>
          <Pane name="Volume" height={80}></Pane>
          <Legend visible={false} />
          <ArgumentAxis
            argumentType="datetime"
            minVisualRangeLength={{ minutes: 10 }}
            defaultVisualRange={{ length: 'hour' }} />
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
          <Crosshair
            enabled={true}
            horizontalLine={{ visible: false }}
          />
        </Chart>
      </div>
    );
  }

  customizePoint(arg) {
    if(arg.seriesName === 'Volume') {
      var point = this.chartRef.instance.getAllSeries()[0].getPointsByArg(arg.argument)[0].data;
      if(point && point.close >= point.open) {
        return { color: '#1db2f5' };
      }
    }
  }
}

export default App;

import React from 'react';
import DataSource from 'devextreme/data/data_source';

import {
  Chart,
  ZoomAndPan,
  ScrollBar,
  ArgumentAxis,
  ValueAxis,
  Title,
  Label,
  Font,
  Legend,
  Series,
  Animation,
  LoadingIndicator
} from 'devextreme-react/chart';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.packetsLock = 0;
    this.HALFDAY = 43200000;
    this.chartDataSource = new DataSource({
      store: [],
      sort: 'date',
      paginate: false
    });
    this.state = {
      visualRange: {
        startValue: new Date(2017, 3, 1),
        endValue: new Date(2017, 3, 15)
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  render() {
    return (
      <Chart
        id="chart"
        title="Temperature in Toronto (2017)"
        dataSource={this.chartDataSource}
        onOptionChanged={this.handleChange}
      >
        <ZoomAndPan argumentAxis="pan" />
        <ScrollBar visible={true} />
        <ArgumentAxis
          argumentType="datetime"
          visualRangeUpdateMode="keep"
          visualRange={this.state.visualRange}
          wholeRange={{
            startValue: new Date(2017, 0, 1),
            endValue: new Date(2017, 11, 31)
          }} />
        <ValueAxis
          name="temperature"
          allowDecimals={false}
        >
          <Title text={'Temperature, &deg;C'}>
            <Font color="#ff950c" />
          </Title>
          <Label>
            <Font color="#ff950c" />
          </Label>
        </ValueAxis>
        <Series
          color="#ff950c"
          type="rangeArea"
          argumentField="date"
          rangeValue1Field="minTemp"
          rangeValue2Field="maxTemp"
          name="Temperature range" />
        <Animation enabled={false} />
        <LoadingIndicator backgroundColor="none">
          <Font size={14} />
        </LoadingIndicator>
        <Legend visible={false} />
      </Chart>
    );
  }

  handleChange(e) {
    if(e.fullName === 'argumentAxis.visualRange') {
      const stateStart = this.state.visualRange.startValue;
      const currentStart = e.value.startValue;
      if(stateStart.valueOf() !== currentStart.valueOf()) {
        this.setState({ visualRange: e.value });
      }
      this.onVisualRangeChanged(e.component);
    }
  }

  onVisualRangeChanged(component) {
    const items = component.getDataSource().items();
    const visualRange = this.state.visualRange;
    if(!items.length ||
      items[0].date - visualRange.startValue >= this.HALFDAY ||
      visualRange.endValue - items[items.length - 1].date >= this.HALFDAY) {
      this.uploadDataByVisualRange(visualRange, component);
    }
  }

  uploadDataByVisualRange(visualRange, component) {
    const dataSource = component.getDataSource();
    const storage = dataSource.items();
    const ajaxArgs = {
      startVisible: getDateString(visualRange.startValue),
      endVisible: getDateString(visualRange.endValue),
      startBound: getDateString(storage.length ? storage[0].date : null),
      endBound: getDateString(storage.length ?
        storage[storage.length - 1].date : null)
    };

    if(ajaxArgs.startVisible !== ajaxArgs.startBound &&
      ajaxArgs.endVisible !== ajaxArgs.endBound && !this.packetsLock) {
      this.packetsLock++;
      component.showLoadingIndicator();

      getDataFrame(ajaxArgs)
        .then(dataFrame => {
          this.packetsLock--;
          dataFrame = dataFrame.map(i => {
            return {
              date: new Date(i.Date),
              minTemp: i.MinTemp,
              maxTemp: i.MaxTemp
            };
          });

          const componentStorage = dataSource.store();
          dataFrame.forEach(item => componentStorage.insert(item));
          dataSource.reload();

          this.onVisualRangeChanged(component);
        })
        .catch(() => {
          this.packetsLock--;
          dataSource.reload();
        });
    }
  }
}

function getDataFrame(args) {
  let params = '?';

  params += `startVisible=${args.startVisible}
    &endVisible=${args.endVisible}
    &startBound=${args.startBound}
    &endBound=${args.endBound}`;

  return fetch(`https://js.devexpress.com/Demos/WidgetsGallery/data/temperatureData${params}`)
    .then(response => response.json());
}

function getDateString(dateTime) {
  return dateTime ? dateTime.toLocaleDateString('en-US') : '';
}

export default App;

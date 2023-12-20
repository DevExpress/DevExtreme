import React, { useCallback, useState } from 'react';
import DataSource from 'devextreme/data/data_source';
import {
  Chart,
  ChartTypes,
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
  LoadingIndicator,
} from 'devextreme-react/chart';

const HALFDAY = 43200000;
let packetsLock = 0;

const chartDataSource = new DataSource({
  store: [],
  sort: 'date',
  paginate: false,
});

const wholeRange = {
  startValue: new Date(2017, 0, 1),
  endValue: new Date(2017, 11, 31),
};

function App() {
  const [visualRange, setVisualRange] = useState({
    startValue: new Date(2017, 3, 1),
    endValue: new Date(2017, 3, 15),
  });

  const uploadDataByVisualRange = useCallback((component) => {
    const dataSource = component.getDataSource();
    const storage = dataSource.items();
    const ajaxArgs = {
      startVisible: getDateString(visualRange.startValue),
      endVisible: getDateString(visualRange.endValue),
      startBound: getDateString(storage.length ? storage[0].date : null),
      endBound: getDateString(
        storage.length ? storage[storage.length - 1].date : null,
      ),
    };

    if (
      ajaxArgs.startVisible !== ajaxArgs.startBound
      && ajaxArgs.endVisible !== ajaxArgs.endBound
      && !packetsLock
    ) {
      packetsLock += 1;
      component.showLoadingIndicator();

      getDataFrame(ajaxArgs)
        .then((dataFrame) => {
          packetsLock -= 1;

          const componentStorage = dataSource.store();

          dataFrame
            .map((i) => ({
              date: new Date(i.Date),
              minTemp: i.MinTemp,
              maxTemp: i.MaxTemp,
            }))
            .forEach((item) => componentStorage.insert(item));

          dataSource.reload();

          onVisualRangeChanged(component);
        })
        .catch(() => {
          packetsLock -= 1;
          dataSource.reload();
        });
    }
  }, [visualRange]);

  const onVisualRangeChanged = useCallback((component) => {
    const items = component.getDataSource().items();
    if (
      !items.length
      || items[0].date - visualRange.startValue.getTime() >= HALFDAY
      || visualRange.endValue.getTime() - items[items.length - 1].date >= HALFDAY
    ) {
      uploadDataByVisualRange(component);
    }
  }, [visualRange, uploadDataByVisualRange]);

  const handleChange = useCallback((e: ChartTypes.OptionChangedEvent) => {
    if (e.fullName === 'argumentAxis.visualRange') {
      const stateStart = visualRange.startValue;
      const currentStart = e.value.startValue;
      if (stateStart.valueOf() !== currentStart.valueOf()) {
        setVisualRange(e.value);
      }
      onVisualRangeChanged(e.component);
    }
  }, [setVisualRange, visualRange, onVisualRangeChanged]);

  return (
    <Chart
      id="chart"
      title="Temperature in Toronto (2017)"
      dataSource={chartDataSource}
      onOptionChanged={handleChange}
    >
      <ZoomAndPan argumentAxis="pan" />
      <ScrollBar visible={true} />
      <ArgumentAxis
        argumentType="datetime"
        visualRangeUpdateMode="keep"
        visualRange={visualRange}
        wholeRange={wholeRange}
      />
      <ValueAxis name="temperature" allowDecimals={false}>
        <Title text='Temperature, °C'>
          <Font color="#ff950c" />
        </Title>
        <Label>
          <Font color="#ff950c" />
        </Label>
      </ValueAxis>
      <Series
        color="#ff950c"
        type="rangearea"
        argumentField="date"
        rangeValue1Field="minTemp"
        rangeValue2Field="maxTemp"
        name="Temperature range"
      />
      <Animation enabled={false} />
      <LoadingIndicator backgroundColor="none">
        <Font size={14} />
      </LoadingIndicator>
      <Legend visible={false} />
    </Chart>
  );
}

function getDataFrame(args) {
  let params = '?';

  params += `startVisible=${args.startVisible}
    &endVisible=${args.endVisible}
    &startBound=${args.startBound}
    &endBound=${args.endBound}`;

  return fetch(
    `https://js.devexpress.com/Demos/WidgetsGallery/data/temperatureData${params}`,
  ).then((response) => response.json());
}

function getDateString(dateTime) {
  return dateTime ? dateTime.toLocaleDateString('en-US') : '';
}

export default App;

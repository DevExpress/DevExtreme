import React from 'react';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import Chart, {
  ValueAxis, Label, Legend, Series, Size, Export, LoadingIndicator,
} from 'devextreme-react/chart';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';

const temperatureLabel = { 'aria-label': 'Temperature' };
const temperature = [2, 4, 6, 8, 9, 10, 11];
const palette = ['#c3a2cc', '#b7b5e0', '#e48cba'];
let paletteIndex = 0;

const monthWeather = new DataSource({
  store: new CustomStore({
    load: () => fetch('../../../../data/monthWeather.json')
      .then((e) => e.json())
      .catch(() => { throw new Error('Data Loading Error'); }),
    loadMode: 'raw',
  }),
  filter: ['t', '>', '2'],
  paginate: false,
});

function customizeLabel(e: { valueText: string; }) {
  return `${e.valueText}${'&#176C'}`;
}

function customizePoint() {
  const color = palette[paletteIndex];
  paletteIndex = paletteIndex === 2 ? 0 : paletteIndex + 1;
  return { color };
}

function changeTemperature(e: SelectBoxTypes.ValueChangedEvent) {
  monthWeather.filter(['t', '>', e.value]);
  monthWeather.load();
}

function App() {
  return (
    <div id="chart-demo">
      {monthWeather && (
        <Chart
          title="Temperature in Seattle: October 2017"
          dataSource={monthWeather}
          customizePoint={customizePoint}
        >
          <Size height={420} />
          <ValueAxis>
            <Label customizeText={customizeLabel} />
          </ValueAxis>
          <Series argumentField="day" valueField="t" type="bar" />
          <Legend visible={false} />
          <Export enabled={true} />
          <LoadingIndicator enabled={true} />
        </Chart>
      )}
      <div className="action">
        <div className="label">Choose a temperature threshold, &deg;C:</div>
        <SelectBox
          id="choose-temperature"
          dataSource={temperature}
          inputAttr={temperatureLabel}
          defaultValue={2}
          onValueChanged={changeTemperature}
        />
      </div>
    </div>
  );
}

export default App;

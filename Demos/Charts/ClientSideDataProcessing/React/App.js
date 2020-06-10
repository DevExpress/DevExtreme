import React from 'react';

import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

import Chart, {
  ValueAxis,
  Label,
  Legend,
  Series,
  Size,
  Export,
  LoadingIndicator
} from 'devextreme-react/chart';

import SelectBox from 'devextreme-react/select-box';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.temperature = [6, 7, 8, 9, 10, 11, 12];
    this.palette = ['#c3a2cc', '#b7b5e0', '#e48cba'];
    this.paletteIndex = 0;
    this.monthWeather = new DataSource({
      store: new CustomStore({
        load: () => {
          return fetch('../../../../data/monthWeather.json')
            .then(e => e.json())
            .catch(() => { throw 'Data Loading Error'; });
        },
        loadMode: 'raw'
      }),
      filter: ['t', '>', '6'],
      paginate: false
    });

    this.customizePoint = () => {
      const color = this.palette[this.paletteIndex];
      this.paletteIndex = this.paletteIndex === 2 ? 0 : this.paletteIndex + 1;

      return { color };
    };

    this.changeTemperature = (e) => {
      this.monthWeather.filter(['t', '>', e.value]);
      this.monthWeather.load();
    };
  }

  customizeLabel(e) {
    return `${e.valueText}${'&#176C'}`;
  }

  render() {
    return (
      <div id="chart-demo">
        <Chart
          title="Temperature in Barcelona: January 2012"
          dataSource={this.monthWeather}
          customizePoint={this.customizePoint}>
          <Size height={420} />
          <ValueAxis>
            <Label customizeText={this.customizeLabel} />
          </ValueAxis>
          <Series
            argumentField="day"
            valueField="t"
            type="bar"
          />
          <Legend visible={false} />
          <Export enabled={true} />
          <LoadingIndicator enabled={true} />
        </Chart>
        <div className="action">
          <SelectBox
            id="choose-temperature"
            dataSource={this.temperature}
            width={70}
            defaultValue={6}
            onValueChanged={this.changeTemperature} />
          <div className="label">Choose a temperature threshold, &deg;C:
          </div>
        </div>
      </div>
    );
  }
}

export default App;

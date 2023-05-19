import React from 'react';
import {
  LinearGauge, Title, Font, Geometry, Scale, RangeContainer, Range, ValueIndicator, Label,
} from 'devextreme-react/linear-gauge';
import { SelectBox } from 'devextreme-react/select-box';
import { cities, cityLabel } from './data.js';

const customTicks = [900, 1000, 1020, 1100];

const pressureLabelFormat = {
  type: 'decimal',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectBoxValue: cities[0].data,
      temperature: cities[0].data.temperature,
      humidity: cities[0].data.humidity,
      pressure: cities[0].data.pressure,
    };

    this.onSelectionChanged = (e) => {
      const weatherData = e.selectedItem.data;
      this.setState({
        selectBoxValue: weatherData,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        pressure: weatherData.pressure,
      });
    };
  }

  render() {
    const temperatureGaugeStartValue = -40;
    return (
      <div>
        <div className="long-title">
          <h3>Weather Indicators</h3>
        </div>
        <div id="gauge-demo">
          <LinearGauge
            className="gauge-element"
            value={this.state.temperature}
          >
            <Title text="Temperature (°C)">
              <Font size={16} />
            </Title>
            <Geometry orientation="vertical" />
            <Scale startValue={temperatureGaugeStartValue} endValue={40} tickInterval={40} />
            <RangeContainer backgroundColor="none">
              <Range startValue={temperatureGaugeStartValue} endValue={0} color="#679EC5" />
              <Range startValue={0} endValue={40} />
            </RangeContainer>
          </LinearGauge>
          <LinearGauge
            className="gauge-element"
            value={this.state.humidity}
          >
            <Title text="Humidity (%)">
              <Font size={16} />
            </Title>
            <Geometry orientation="vertical" />
            <Scale startValue={0} endValue={100} tickInterval={10} />
            <RangeContainer backgroundColor="#CACACA" />
            <ValueIndicator type="rhombus" color="#A4DDED" />
          </LinearGauge>
          <LinearGauge
            className="gauge-element"
            value={this.state.pressure}
          >
            <Title text="Barometric Pressure (mb)">
              <Font size={16} />
            </Title>
            <Geometry orientation="vertical" />
            <Scale startValue={900} endValue={1100} customTicks={customTicks}>
              <Label format={pressureLabelFormat} />
            </Scale>
            <RangeContainer>
              <Range startValue={900} endValue={1000} color="#679EC5" />
              <Range startValue={1000} endValue={1020} color="#A6C567" />
              <Range startValue={1020} endValue={1100} color="#E18E92" />
            </RangeContainer>
            <ValueIndicator type="circle" color="#E3A857" />
          </LinearGauge>
        </div>
        <SelectBox
          dataSource={cities}
          valueExpr="data"
          inputAttr={cityLabel}
          value={this.state.selectBoxValue}
          displayExpr="name"
          onSelectionChanged={this.onSelectionChanged}
        />
      </div>
    );
  }
}

export default App;

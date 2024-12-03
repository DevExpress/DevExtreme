import React, { useCallback, useState } from 'react';
import {
  LinearGauge, Title, Font, Geometry, Scale, RangeContainer, Range, ValueIndicator, Label,
} from 'devextreme-react/linear-gauge';
import { SelectBox, SelectBoxTypes } from 'devextreme-react/select-box';
import { cities, cityLabel } from './data.ts';

const customTicks = [900, 1000, 1020, 1100];
const temperatureGaugeStartValue = -40;

const pressureLabelFormat = {
  type: 'decimal',
};

function App() {
  const [selectBoxValue, setSelectBoxValue] = useState(cities[0].data);
  const [temperature, setTemperature] = useState(cities[0].data.temperature);
  const [humidity, setHumidity] = useState(cities[0].data.humidity);
  const [pressure, setPressure] = useState(cities[0].data.pressure);

  const onSelectionChanged = useCallback((e: SelectBoxTypes.SelectionChangedEvent) => {
    const weatherData = e.selectedItem.data;
    setSelectBoxValue(weatherData);
    setTemperature(weatherData.temperature);
    setHumidity(weatherData.humidity);
    setPressure(weatherData.pressure);
  }, [setSelectBoxValue, setTemperature, setHumidity, setPressure]);

  return (
    <div>
      <div className="long-title">
        <h3>Weather Indicators</h3>
      </div>
      <div id="gauge-demo">
        <LinearGauge
          className="gauge-element"
          value={temperature}
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
          value={humidity}
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
          value={pressure}
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
        value={selectBoxValue}
        displayExpr="name"
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
}

export default App;

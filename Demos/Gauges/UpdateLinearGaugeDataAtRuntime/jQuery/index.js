$(() => {
  const temperatureGauge = $('#temperatureGauge').dxLinearGauge({
    title: {
      text: 'Temperature (°C)',
      font: {
        size: 16,
      },
    },
    geometry: { orientation: 'vertical' },
    scale: {
      startValue: -40,
      endValue: 40,
      tickInterval: 40,
    },
    rangeContainer: {
      backgroundColor: 'none',
      ranges: [
        { startValue: -40, endValue: 0, color: '#679EC5' },
        { startValue: 0, endValue: 40 },
      ],
    },
    value: cities[0].data.temperature,
  }).dxLinearGauge('instance');

  const humidityGauge = $('#humidityGauge').dxLinearGauge({
    title: {
      text: 'Humidity (%)',
      font: {
        size: 16,
      },
    },
    geometry: { orientation: 'vertical' },
    scale: {
      startValue: 0,
      endValue: 100,
      tickInterval: 10,
    },
    rangeContainer: { backgroundColor: '#CACACA' },
    valueIndicator: { type: 'rhombus', color: '#A4DDED' },
    value: cities[0].data.humidity,
  }).dxLinearGauge('instance');

  const pressureGauge = $('#pressureGauge').dxLinearGauge({
    title: {
      text: 'Barometric Pressure (mb)',
      font: {
        size: 16,
      },
    },
    geometry: { orientation: 'vertical' },
    scale: {
      label: {
        format: {
          type: 'decimal',
        },
      },
      startValue: 900,
      endValue: 1100,
      customTicks: [900, 1000, 1020, 1100],
    },
    rangeContainer: {
      ranges: [
        { startValue: 900, endValue: 1000, color: '#679EC5' },
        { startValue: 1000, endValue: 1020, color: '#A6C567' },
        { startValue: 1020, endValue: 1100, color: '#E18E92' },
      ],
    },
    valueIndicator: { type: 'circle', color: '#E3A857' },
    value: cities[0].data.pressure,
  }).dxLinearGauge('instance');

  $('#selectbox').dxSelectBox({
    dataSource: cities,
    inputAttr: { 'aria-label': 'City' },
    onSelectionChanged(e) {
      const weatherData = e.selectedItem.data;

      temperatureGauge.option('value', weatherData.temperature);
      humidityGauge.option('value', weatherData.humidity);
      pressureGauge.option('value', weatherData.pressure);
    },
    displayExpr: 'name',
    value: cities[0],
  });
});

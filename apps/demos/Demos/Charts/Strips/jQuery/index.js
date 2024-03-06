$(() => {
  const highAverage = 60.8;
  const lowAverage = 53;
  const highAverageColor = '#ff9b52';
  const lowAverageColor = '#6199e6';

  $('#chart').dxChart({
    dataSource,
    series: [{
      argumentField: 'day',
      valueField: 'temperature',
      type: 'spline',
      color: '#a3aaaa',
    }],
    valueAxis: {
      label: {
        customizeText,
      },
      strips: [{
        label: {
          text: 'Above average high',
          font: {
            color: highAverageColor,
          },
        },
        startValue: highAverage,
        color: 'rgba(255,155,85,0.15)',
      },
      {
        label: {
          text: 'Below average low',
          font: {
            color: lowAverageColor,
          },
        },
        endValue: lowAverage,
        color: 'rgba(97,153,230,0.1)',
      }],
      stripStyle: {
        label: {
          font: {
            weight: 500,
            size: 14,
          },
        },
      },
    },
    export: {
      enabled: true,
    },
    title: 'Temperature (high) in September, &#176;F',
    legend: {
      visible: false,
    },
    customizePoint() {
      if (this.value > highAverage) {
        return { color: highAverageColor };
      }
      if (this.value < lowAverage) {
        return { color: lowAverageColor };
      }
      return null;
    },
    customizeLabel() {
      if (this.value > highAverage) {
        return getLabelsSettings(highAverageColor);
      }
      if (this.value < lowAverage) {
        return getLabelsSettings(lowAverageColor);
      }
      return null;
    },
  });

  function customizeText() {
    return `${this.valueText}&#176F`;
  }
  function getLabelsSettings(backgroundColor) {
    return {
      visible: true,
      backgroundColor,
      customizeText,
    };
  }
});

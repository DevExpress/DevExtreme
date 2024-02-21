$(() => {
  const highAverage = 77;
  const lowAverage = 58;

  $('#chart').dxChart({
    dataSource,
    customizePoint() {
      if (this.value > highAverage) {
        return { color: '#ff7c7c', hoverStyle: { color: '#ff7c7c' } };
      }
      if (this.value < lowAverage) {
        return { color: '#8c8cff', hoverStyle: { color: '#8c8cff' } };
      }
      return null;
    },
    customizeLabel() {
      if (this.value > highAverage) {
        return {
          visible: true,
          backgroundColor: '#ff7c7c',
          customizeText() {
            return `${this.valueText}&#176F`;
          },
        };
      }
      return null;
    },
    export: {
      enabled: true,
    },
    valueAxis: {
      visualRange: {
        startValue: 40,
      },
      maxValueMargin: 0.01,
      label: {
        customizeText() {
          return `${this.valueText}&#176F`;
        },
      },
      constantLines: [{
        label: {
          text: 'Low Average',
        },
        width: 2,
        value: lowAverage,
        color: '#8c8cff',
        dashStyle: 'dash',
      }, {
        label: {
          text: 'High Average',
        },
        width: 2,
        value: highAverage,
        color: '#ff7c7c',
        dashStyle: 'dash',
      }],
    },
    series: [{
      argumentField: 'day',
      valueField: 'temperature',
      type: 'bar',
      color: '#e7d19a',
    }],
    title: {
      text: 'Daily Temperature in May',
    },
    legend: {
      visible: false,
    },
  });
});

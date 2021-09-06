window.onload = function () {
  const lineStyleValue = ko.observable(lineStyles[0]);
  const breaksCountValue = ko.observable(breaksCount[2]);
  const autoBreaksEnabledValue = ko.observable(true);
  const viewModel = {
    chartOptions: {
      dataSource,
      series: {
        type: 'bar',
        valueField: 'mass',
        argumentField: 'name',
      },
      valueAxis: {
        visible: true,
        autoBreaksEnabled: autoBreaksEnabledValue,
        maxAutoBreakCount: breaksCountValue,
        breakStyle: {
          line: lineStyleValue,
        },
      },
      title: 'Relative Masses of the Heaviest\n Solar System Objects',
      legend: {
        visible: false,
      },
      tooltip: {
        enabled: true,
      },
    },

    breaksCheckBoxOptions: {
      text: 'Enable Breaks',
      value: autoBreaksEnabledValue,
    },

    maxCountSelectBoxOptions: {
      items: breaksCount,
      value: breaksCountValue,
      width: 80,
    },

    lineStyleSelectBoxOptions: {
      items: lineStyles,
      value: lineStyleValue,
      width: 120,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};

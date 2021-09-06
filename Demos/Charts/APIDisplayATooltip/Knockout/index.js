window.onload = function () {
  const selectedRegion = ko.observable();

  const viewModel = {
    pieChartOptions: {
      type: 'doughnut',
      palette: 'Soft Pastel',
      dataSource,
      title: 'The Population of Continents and Regions',
      tooltip: {
        enabled: false,
        format: 'millions',
        customizeTooltip(arg) {
          return {
            text: `${arg.argumentText}<br/>${arg.valueText}`,
          };
        },
      },
      size: {
        height: 350,
      },
      onPointClick(e) {
        const point = e.target;
        point.showTooltip();
        selectedRegion(point.argument);
      },
      legend: {
        visible: false,
      },
      series: [{
        argumentField: 'region',
      }],
    },
    selectBoxOptions: {
      width: 250,
      dataSource,
      displayExpr: 'region',
      valueExpr: 'region',
      placeholder: 'Choose region',
      value: selectedRegion,
      onValueChanged(data) {
        $('#chart').dxPieChart('instance').getAllSeries()[0].getPointsByArg(data.value)[0].showTooltip();
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};

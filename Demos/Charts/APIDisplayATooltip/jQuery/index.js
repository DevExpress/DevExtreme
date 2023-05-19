$(() => {
  const chart = $('#chart').dxPieChart({
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
      region.option('value', point.argument);
    },
    legend: {
      visible: false,
    },
    series: [{
      argumentField: 'region',
    }],
  }).dxPieChart('instance');

  const region = $('#selectbox').dxSelectBox({
    width: 250,
    dataSource,
    displayExpr: 'region',
    inputAttr: { 'aria-label': 'Region' },
    valueExpr: 'region',
    placeholder: 'Choose region',
    onValueChanged(data) {
      chart.getAllSeries()[0].getPointsByArg(data.value)[0].showTooltip();
    },
  }).dxSelectBox('instance');
});

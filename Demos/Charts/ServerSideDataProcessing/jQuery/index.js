$(() => {
  const chartDataSource = new DevExpress.data.DataSource({
    store: {
      type: 'odata',
      url: 'https://js.devexpress.com/Demos/WidgetsGallery/odata/WeatherItems',
    },
    postProcess(results) {
      return results[0].DayItems;
    },
    expand: 'DayItems',
    filter: ['Id', '=', 1],
    paginate: false,
  });

  const chartOptions = {
    dataSource: chartDataSource,
    title: 'Temperature in Seattle , 2017',
    size: {
      height: 420,
    },
    series: {
      argumentField: 'Number',
      valueField: 'Temperature',
      type: 'spline',
    },
    legend: {
      visible: false,
    },
    commonPaneSettings: {
      border: {
        visible: true,
        width: 2,
        top: false,
        right: false,
      },
    },
    export: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
      customizeTooltip(arg) {
        return {
          text: `${arg.valueText}&#176C`,
        };
      },
    },
    valueAxis: {
      valueType: 'numeric',
      grid: {
        opacity: 0.2,
      },
      label: {
        customizeText() {
          return `${this.valueText}&#176C`;
        },
      },
    },
    argumentAxis: {
      type: 'discrete',
      grid: {
        visible: true,
        opacity: 0.5,
      },
    },
    loadingIndicator: {
      enabled: true,
    },
  };

  $('#chart').dxChart(chartOptions);

  $('#selectbox').dxSelectBox({
    width: 150,
    items: months,
    value: 1,
    inputAttr: { 'aria-label': 'Month' },
    valueExpr: 'id',
    displayExpr: 'name',
    onValueChanged(data) {
      chartDataSource.filter(['Id', '=', data.value]);
      chartDataSource.load();
    },
  });
});

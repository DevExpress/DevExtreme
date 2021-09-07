window.onload = function () {
  const source = new DevExpress.data.DataSource({
    load() {
      const d = $.Deferred();
      $('#chart').dxChart('instance').showLoadingIndicator();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '../../../../data/monthWeather.json', true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.responseText) {
          d.resolve(JSON.parse(xhr.responseText));
        }
      };
      xhr.send();
      return d.promise();
    },
    loadMode: 'raw',
    filter: ['t', '>', '2'],
    paginate: false,
  });

  const palette = ['#c3a2cc', '#b7b5e0', '#e48cba'];
  let paletteIndex = 0;

  const viewModel = {
    chartOptions: {
      dataSource: source,
      title: 'Temperature in Seattle: October 2017',
      size: {
        height: 420,
      },
      series: {
        argumentField: 'day',
        valueField: 't',
        type: 'bar',
      },
      customizePoint() {
        const color = palette[paletteIndex];
        paletteIndex = paletteIndex === 2 ? 0 : paletteIndex + 1;

        return {
          color,
        };
      },
      legend: {
        visible: false,
      },
      export: {
        enabled: true,
      },
      valueAxis: {
        label: {
          customizeText() {
            return `${this.valueText}&#176C`;
          },
        },
      },
    },
    temperatureOptions: {
      dataSource: [2, 4, 6, 8, 9, 10, 11],
      value: 2,
      onValueChanged(data) {
        const t = data.value;
        source.filter(['t', '>', t]);
        source.load();
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};

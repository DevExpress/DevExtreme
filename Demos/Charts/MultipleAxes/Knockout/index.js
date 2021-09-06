window.onload = function () {
  const viewModel = {
    chartOptions: {
      palette: 'vintage',
      dataSource,
      commonSeriesSettings: {
        argumentField: 'year',
        type: 'fullstackedbar',
      },
      series: [{
        valueField: 'africa',
        name: 'Africa',
      }, {
        valueField: 'asia',
        name: 'Asia',
      }, {
        valueField: 'europe',
        name: 'Europe',
      }, {
        valueField: 'latinamerica',
        name: 'Latin America & Caribbean',
      }, {
        valueField: 'northamerica',
        name: 'Northern America',
      }, {
        valueField: 'oceania',
        name: 'Oceania',
      }, {
        axis: 'total',
        type: 'spline',
        valueField: 'total',
        name: 'Total',
        color: '#008fd8',
      },
      ],
      valueAxis: [{
        grid: {
          visible: true,
        },
      }, {
        name: 'total',
        position: 'right',
        grid: {
          visible: true,
        },
        title: {
          text: 'Total Population, billions',
        },
      }],
      tooltip: {
        enabled: true,
        shared: true,
        format: {
          type: 'largeNumber',
          precision: 1,
        },
        customizeTooltip(arg) {
          const items = arg.valueText.split('\n');
          const color = arg.point.getColor();
          $.each(items, (index, item) => {
            if (item.indexOf(arg.seriesName) === 0) {
              items[index] = $('<span>')
                .text(item)
                .addClass('active')
                .css('color', color)
                .prop('outerHTML');
            }
          });
          return { text: items.join('\n') };
        },
      },
      legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
      },
      export: {
        enabled: true,
      },
      title: {
        text: 'Evolution of Population by Continent',
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};

$(() => {
  $('#pie').dxPieChart({
    size: {
      width: 500,
    },
    palette: 'bright',
    dataSource,
    series: [
      {
        argumentField: 'country',
        valueField: 'area',
        label: {
          visible: true,
          connector: {
            visible: true,
            width: 1,
          },
        },
      },
    ],
    title: 'Area of Countries',
    export: {
      enabled: true,
    },
    onPointClick(e) {
      const point = e.target;

      toggleVisibility(point);
    },
    onLegendClick(e) {
      const arg = e.target;

      toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
    },
  });

  function toggleVisibility(item) {
    if (item.isVisible()) {
      item.hide();
    } else {
      item.show();
    }
  }
});

$(() => {
  const copOptions = {
    dataSource: copperCosts,
    argumentField: 'month',
    valueField: '2021',
    type: 'area',
    showMinMax: true,
    tooltip: {
      format: 'currency',
    },
  };
  const nickOptions = {
    dataSource: nickelCosts,
    argumentField: 'month',
    valueField: '2021',
    type: 'splinearea',
    lineColor: '#8076bb',
    minColor: '#6babac',
    maxColor: '#8076bb',
    pointSize: 6,
    showMinMax: true,
    showFirstLast: false,
    tooltip: {
      format: 'currency',
    },
  };
  const palOptions = {
    dataSource: palladiumCosts,
    argumentField: 'month',
    valueField: '2021',
    firstLastColor: '#e55253',
    lineColor: '#7e4452',
    lineWidth: 3,
    pointColor: '#e8c267',
    pointSymbol: 'polygon',
    type: 'steparea',
    tooltip: {
      format: {
        type: 'currency',
        precision: 2,
      },
    },
  };

  $('.area2021').dxSparkline(copOptions);
  $('.splinearea2021').dxSparkline(nickOptions);
  $('.steparea2021').dxSparkline(palOptions);

  $('.area2022').dxSparkline($.extend(copOptions, { valueField: '2022' }));
  $('.splinearea2022').dxSparkline($.extend(nickOptions, { valueField: '2022' }));
  $('.steparea2022').dxSparkline($.extend(palOptions, { valueField: '2022' }));

  $('.area2023').dxSparkline($.extend(copOptions, { valueField: '2023' }));
  $('.splinearea2023').dxSparkline($.extend(nickOptions, { valueField: '2023' }));
  $('.steparea2023').dxSparkline($.extend(palOptions, { valueField: '2023' }));
});

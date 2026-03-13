$(() => {
  const oilOptions = {
    dataSource: oilCosts,
    argumentField: 'month',
    valueField: '2021',
    type: 'line',
    showMinMax: true,
    tooltip: {
      format: {
        type: 'currency',
        precision: 2,
      },
    },
  };
  const goldOptions = {
    dataSource: goldCosts,
    argumentField: 'month',
    valueField: '2021',
    type: 'spline',
    lineWidth: 3,
    lineColor: '#9ab57e',
    minColor: '#6babac',
    maxColor: '#ebdd8f',
    showMinMax: true,
    showFirstLast: false,
    tooltip: {
      format: {
        type: 'currency',
        precision: 2,
      },
    },
  };
  const silverOptions = {
    dataSource: silverCosts,
    argumentField: 'month',
    valueField: '2021',
    lineColor: '#e8c267',
    firstLastColor: '#e55253',
    pointSize: 6,
    pointSymbol: 'square',
    pointColor: '#ebdd8f',
    type: 'stepline',
    tooltip: {
      format: {
        type: 'currency',
        precision: 2,
      },
    },
  };

  $('.line2021').dxSparkline(oilOptions);
  $('.spline2021').dxSparkline(goldOptions);
  $('.stepline2021').dxSparkline(silverOptions);

  $('.line2022').dxSparkline($.extend(oilOptions, { valueField: '2022' }));
  $('.spline2022').dxSparkline($.extend(goldOptions, { valueField: '2022' }));
  $('.stepline2022').dxSparkline($.extend(silverOptions, { valueField: '2022' }));

  $('.line2023').dxSparkline($.extend(oilOptions, { valueField: '2023' }));
  $('.spline2023').dxSparkline($.extend(goldOptions, { valueField: '2023' }));
  $('.stepline2023').dxSparkline($.extend(silverOptions, { valueField: '2023' }));
});

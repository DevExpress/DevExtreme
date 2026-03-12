$(() => {
  const copperOptions = {
    dataSource: copperCosts,
    argumentField: 'month',
    valueField: '2021',
    type: 'winloss',
    showMinMax: true,
    winlossThreshold: 8000,
    tooltip: {
      format: 'currency',
      precision: 2,
    },
  };
  const nickelOptions = {
    dataSource: nickelCosts,
    argumentField: 'month',
    valueField: '2021',
    type: 'winloss',
    showMinMax: true,
    showFirstLast: false,
    winColor: '#6babac',
    lossColor: '#8076bb',
    winlossThreshold: 19000,
    tooltip: {
      format: 'currency',
      precision: 2,
    },
  };
  const palladiumOptions = {
    dataSource: palladiumCosts,
    argumentField: 'month',
    valueField: '2021',
    type: 'winloss',
    winlossThreshold: 2000,
    winColor: '#7e4452',
    lossColor: '#ebdd8f',
    firstLastColor: '#e55253',
    tooltip: {
      format: 'currency',
      precision: 2,
    },
  };

  $('.copper2021').dxSparkline(copperOptions);
  $('.nickel2021').dxSparkline(nickelOptions);
  $('.palladium2021').dxSparkline(palladiumOptions);

  $('.copper2022').dxSparkline($.extend(copperOptions, { valueField: '2022' }));
  $('.nickel2022').dxSparkline($.extend(nickelOptions, { valueField: '2022' }));
  $('.palladium2022').dxSparkline($.extend(palladiumOptions, { valueField: '2022' }));

  $('.copper2023').dxSparkline($.extend(copperOptions, { valueField: '2023' }));
  $('.nickel2023').dxSparkline($.extend(nickelOptions, { valueField: '2023' }));
  $('.palladium2023').dxSparkline($.extend(palladiumOptions, { valueField: '2023' }));
});

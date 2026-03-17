$(() => {
  const source = new DevExpress.data.DataSource({
    load() {
      return $.getJSON('../../../../data/resourceData.json');
    },
    loadMode: 'raw',
    filter: ['month', '<=', '12'],
    paginate: false,
  });

  const copOptions = {
    dataSource: source,
    argumentField: 'month',
    valueField: 'copper2021',
    type: 'bar',
    showMinMax: true,
    tooltip: {
      format: {
        type: 'currency',
        precision: 2,
      },
    },
  };
  const nickOptions = {
    dataSource: source,
    argumentField: 'month',
    valueField: 'nickel2021',
    type: 'bar',
    showMinMax: true,
    showFirstLast: false,
    barPositiveColor: '#6babac',
    minColor: '#9ab57e',
    maxColor: '#8076bb',
    tooltip: {
      format: {
        type: 'currency',
        precision: 2,
      },
    },
  };
  const palOptions = {
    dataSource: source,
    argumentField: 'month',
    valueField: 'palladium2021',
    type: 'bar',
    barPositiveColor: '#e55253',
    firstLastColor: '#ebdd8f',
    tooltip: {
      format: {
        type: 'currency',
        precision: 2,
      },
    },
  };

  $('#choose-months').dxSelectBox({
    dataSource: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    value: 12,
    inputAttr: { 'aria-label': 'Month' },
    onValueChanged(data) {
      const count = data.value;
      source.filter(['month', '<=', count]);
      source.load();
    },
  });

  $('.cop2021').dxSparkline(copOptions);
  $('.nick2021').dxSparkline(nickOptions);
  $('.pal2021').dxSparkline(palOptions);

  $('.cop2022').dxSparkline($.extend(copOptions, { valueField: 'copper2022' }));
  $('.nick2022').dxSparkline($.extend(nickOptions, { valueField: 'nickel2022' }));
  $('.pal2022').dxSparkline($.extend(palOptions, { valueField: 'palladium2022' }));

  $('.cop2023').dxSparkline($.extend(copOptions, { valueField: 'copper2023' }));
  $('.nick2023').dxSparkline($.extend(nickOptions, { valueField: 'nickel2023' }));
  $('.pal2023').dxSparkline($.extend(palOptions, { valueField: 'palladium2023' }));
});

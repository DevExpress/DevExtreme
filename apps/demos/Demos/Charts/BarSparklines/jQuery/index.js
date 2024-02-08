$(() => {
  const source = new DevExpress.data.DataSource({
    load() {
      return $.getJSON('../../../../data/resourceData.json');
    },
    loadMode: 'raw',
    filter: ['month', '<=', '12'],
    paginate: false,
  });

  const alumOptions = {
    dataSource: source,
    argumentField: 'month',
    valueField: 'alum2010',
    type: 'bar',
    showMinMax: true,
    tooltip: {
      format: 'currency',
    },
  };
  const nickOptions = {
    dataSource: source,
    argumentField: 'month',
    valueField: 'nickel2010',
    type: 'bar',
    showMinMax: true,
    showFirstLast: false,
    barPositiveColor: '#6babac',
    minColor: '#9ab57e',
    maxColor: '#8076bb',
    tooltip: {
      format: 'currency',
    },
  };
  const copOptions = {
    dataSource: source,
    argumentField: 'month',
    valueField: 'copper2010',
    type: 'bar',
    barPositiveColor: '#e55253',
    firstLastColor: '#ebdd8f',
    tooltip: {
      format: 'currency',
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

  $('.alum2010').dxSparkline(alumOptions);
  $('.nick2010').dxSparkline(nickOptions);
  $('.cop2010').dxSparkline(copOptions);

  $('.alum2011').dxSparkline($.extend(alumOptions, { valueField: 'alum2011' }));
  $('.nick2011').dxSparkline($.extend(nickOptions, { valueField: 'nickel2011' }));
  $('.cop2011').dxSparkline($.extend(copOptions, { valueField: 'copper2011' }));

  $('.alum2012').dxSparkline($.extend(alumOptions, { valueField: 'alum2012' }));
  $('.nick2012').dxSparkline($.extend(nickOptions, { valueField: 'nickel2012' }));
  $('.cop2012').dxSparkline($.extend(copOptions, { valueField: 'copper2012' }));
});

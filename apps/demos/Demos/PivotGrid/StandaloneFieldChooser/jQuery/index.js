$(() => {
  const salesPivotGrid = $('#sales').dxPivotGrid({
    allowSortingBySummary: true,
    allowSorting: true,
    allowFiltering: true,
    showBorders: true,
    dataSource: {
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
        headerFilter: {
          search: {
            enabled: true,
          },
        },
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
        headerFilter: {
          search: {
            enabled: true,
          },
        },
        selector(data) {
          return `${data.city} (${data.country})`;
        },
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }, {
        caption: 'Sales',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      }],
      store: sales,
    },
    fieldChooser: {
      enabled: false,
    },
  }).dxPivotGrid('instance');

  const salesFieldChooser = $('#sales-fieldchooser').dxPivotGridFieldChooser({
    dataSource: salesPivotGrid.getDataSource(),
    texts: {
      allFields: 'All',
      columnFields: 'Columns',
      dataFields: 'Data',
      rowFields: 'Rows',
      filterFields: 'Filter',
    },
    width: 400,
    height: 400,
  }).dxPivotGridFieldChooser('instance');

  const applyButton = $('#applyButton').dxButton({
    text: 'Apply',
    visible: false,
    type: 'default',
    onClick() {
      salesFieldChooser.applyChanges();
    },
  }).dxButton('instance');

  const cancelButton = $('#cancelButton').dxButton({
    text: 'Cancel',
    visible: false,
    onClick() {
      salesFieldChooser.cancelChanges();
    },
  }).dxButton('instance');

  $('#layouts').dxRadioGroup({
    items: layouts,
    layout: 'vertical',
    valueExpr: 'key',
    displayExpr: 'name',
    value: 0,
    onValueChanged(e) {
      salesFieldChooser.option('layout', e.value);
    },
  });

  $('#applyChangesMode').dxSelectBox({
    items: ['instantly', 'onDemand'],
    width: 180,
    value: 'instantly',
    inputAttr: { 'aria-label': 'Apply Changes Mode' },
    onValueChanged(data) {
      salesFieldChooser.option('applyChangesMode', data.value);
      applyButton.option('visible', data.value === 'onDemand');
      cancelButton.option('visible', data.value === 'onDemand');
    },
  });
});

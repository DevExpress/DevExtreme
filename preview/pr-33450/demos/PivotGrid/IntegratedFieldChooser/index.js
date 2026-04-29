$(() => {
  const salesPivotGrid = $('#sales').dxPivotGrid({
    allowSortingBySummary: true,
    allowSorting: true,
    allowFiltering: true,
    showBorders: true,
    height: 470,
    fieldChooser: {
      enabled: true,
      applyChangesMode: 'instantly',
      allowSearch: true,
    },
    dataSource: {
      fields: [
        { dataField: '[Product].[Category]', area: 'row' },
        {
          dataField: '[Product].[Subcategory]',
          area: 'row',
          headerFilter: {
            search: {
              enabled: true,
            },
          },
        },
        { dataField: '[Ship Date].[Calendar Year]', area: 'column' },
        { dataField: '[Ship Date].[Month of Year]', area: 'column' },
        { dataField: '[Measures].[Customer Count]', area: 'data' },
      ],
      store: {
        type: 'xmla',
        url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
        catalog: 'Adventure Works DW Standard Edition',
        cube: 'Adventure Works',
      },
    },
  }).dxPivotGrid('instance');

  $('#applyChangesMode').dxSelectBox({
    items: ['instantly', 'onDemand'],
    inputAttr: { 'aria-label': 'Apply Changes Mode' },
    width: 180,
    value: 'instantly',
    onValueChanged(data) {
      salesPivotGrid.option('fieldChooser.applyChangesMode', data.value);
    },
  });
});

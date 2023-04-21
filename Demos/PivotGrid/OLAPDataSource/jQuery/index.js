$(() => {
  $('#sales').dxPivotGrid({
    allowSortingBySummary: true,
    allowSorting: true,
    allowFiltering: true,
    allowExpandAll: true,
    height: 570,
    showBorders: true,
    fieldChooser: {
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
        { dataField: '[Measures].[Reseller Freight Cost]', area: 'data', format: 'currency' },
      ],
      store: {
        type: 'xmla',
        url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
        catalog: 'Adventure Works DW Standard Edition',
        cube: 'Adventure Works',
      },
    },
  });
});

$(() => {
  $('#sales').dxPivotGrid({
    allowSorting: true,
    allowFiltering: true,
    height: 570,
    showBorders: true,
    fieldPanel: {
      visible: true,
      showFilterFields: false,
    },
    fieldChooser: {
      allowSearch: true,
    },
    headerFilter: {
      search: {
        enabled: true,
      },
    },
    scrolling: {
      mode: 'virtual',
    },
    dataSource: {
      paginate: true,
      fields: [
        { dataField: '[Customer].[Customer]', area: 'row' },
        { dataField: '[Ship Date].[Calendar Year]', area: 'column' },
        { dataField: '[Ship Date].[Month of Year]', area: 'column' },
        { dataField: '[Measures].[Internet Sales Amount]', area: 'data' },
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

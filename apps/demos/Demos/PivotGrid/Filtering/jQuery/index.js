$(() => {
  const salesPivotGrid = $('#sales').dxPivotGrid({
    allowFiltering: true,
    allowSorting: true,
    allowSortingBySummary: true,
    height: 570,
    showBorders: true,
    headerFilter: {
      search: {
        enabled: true,
      },
      showRelevantValues: true,
      width: 300,
      height: 400,
    },
    fieldChooser: {
      allowSearch: true,
    },
    fieldPanel: {
      visible: true,
    },
    dataSource: {
      fields: [
        { dataField: '[Product].[Category]', area: 'column' },
        { dataField: '[Product].[Subcategory]', area: 'column' },
        { dataField: '[Customer].[City]', area: 'row' },
        { dataField: '[Measures].[Internet Total Product Cost]', area: 'data', format: 'currency' },
        {
          dataField: '[Customer].[Country]',
          area: 'filter',
          filterValues: ['[Customer].[Country].&[United Kingdom]'],
        },
        {
          dataField: '[Ship Date].[Calendar Year]',
          area: 'filter',
          filterValues: ['[Ship Date].[Calendar Year].&[2004]'],
        },
      ],
      store: {
        type: 'xmla',
        url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
        catalog: 'Adventure Works DW Standard Edition',
        cube: 'Adventure Works',
      },
    },
  }).dxPivotGrid('instance');

  $('#allow-search').dxCheckBox({
    text: 'Allow Search',
    value: true,
    onValueChanged(data) {
      salesPivotGrid.option('headerFilter.search.enabled', data.value);
    },
  });

  $('#show-relevant-values').dxCheckBox({
    text: 'Show Relevant Values',
    value: true,
    onValueChanged(data) {
      salesPivotGrid.option('headerFilter.showRelevantValues', data.value);
    },
  });
});

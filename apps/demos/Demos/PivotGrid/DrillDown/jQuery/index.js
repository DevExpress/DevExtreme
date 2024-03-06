$(() => {
  let drillDownDataSource = {};

  $('#sales').dxPivotGrid({
    allowSortingBySummary: true,
    allowSorting: true,
    allowFiltering: true,
    allowExpandAll: true,
    showBorders: true,
    fieldChooser: {
      enabled: false,
    },
    onCellClick(e) {
      if (e.area === 'data') {
        const pivotGridDataSource = e.component.getDataSource();
        const rowPathLength = e.cell.rowPath.length;
        const rowPathName = e.cell.rowPath[rowPathLength - 1];
        const popupTitle = `${rowPathName || 'Total'} Drill Down Data`;

        drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(e.cell);
        salesPopup.option('title', popupTitle);
        salesPopup.show();
      }
    },
    dataSource: {
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }, {
        caption: 'Total',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      }],
      store: sales,
    },
  });

  const salesPopup = $('#sales-popup').dxPopup({
    width: 600,
    height: 400,
    showCloseButton: true,
    contentTemplate(contentElement) {
      $('<div />')
        .addClass('drill-down')
        .dxDataGrid({
          width: 560,
          height: 300,
          columns: ['region', 'city', 'amount', 'date'],
        })
        .appendTo(contentElement);
    },
    onShowing() {
      $('.drill-down')
        .dxDataGrid('instance')
        .option('dataSource', drillDownDataSource);
    },
    onShown() {
      $('.drill-down')
        .dxDataGrid('instance')
        .updateDimensions();
    },
  }).dxPopup('instance');
});

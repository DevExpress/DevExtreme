window.onload = function () {
  const drillDownDataSource = ko.observable({});
  const salesPopupVisible = ko.observable(false);
  const salesPopupTitle = ko.observable('');

  const viewModel = {
    drillDownDataSource,
    pivotGridOptions: {
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

          drillDownDataSource(pivotGridDataSource.createDrillDownDataSource(e.cell));
          salesPopupTitle(popupTitle);
          salesPopupVisible(true);
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
    },
    dataGridOptions: {
      dataSource: drillDownDataSource,
      width: 560,
      height: 300,
      columns: ['region', 'city', 'amount', 'date'],
    },
    popupOptions: {
      title: salesPopupTitle,
      width: 600,
      height: 400,
      visible: salesPopupVisible,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('pivotgrid'));
};

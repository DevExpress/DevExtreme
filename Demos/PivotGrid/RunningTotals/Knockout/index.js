window.onload = function () {
  const viewModel = {
    pivotGridOptions: {
      allowSortingBySummary: true,
      allowSorting: true,
      allowFiltering: true,
      allowExpandAll: true,
      showColumnTotals: false,
      showTotalsPrior: 'rows',
      showBorders: true,
      fieldChooser: {
        enabled: false,
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
          groupName: 'date',
          groupInterval: 'year',
          expanded: true,
        }, {
          groupName: 'date',
          groupInterval: 'quarter',
          expanded: true,
        }, {
          groupName: 'date',
          groupInterval: 'month',
          visible: false,
        }, {
          caption: 'Total',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
        }, {
          caption: 'Running Total',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          runningTotal: 'row',
          allowCrossGroupCalculation: true,
        }],
        store: sales,
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('pivotgrid'));
};

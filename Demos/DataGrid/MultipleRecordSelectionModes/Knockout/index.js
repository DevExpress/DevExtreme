window.onload = function () {
  const selectAllMode = ko.observable('allPages');
  const showCheckBoxesMode = ko.observable('onClick');

  const viewModel = {
    gridOptions: {
      dataSource: sales,
      keyExpr: 'orderId',
      showBorders: true,
      selection: {
        mode: 'multiple',
        selectAllMode,
        showCheckBoxesMode,
      },
      paging: {
        pageSize: 10,
      },
      filterRow: {
        visible: true,
      },
      columns: [{
        dataField: 'orderId',
        caption: 'Order ID',
        width: 90,
      },
      'city', {
        dataField: 'country',
        width: 180,
      },
      'region', {
        dataField: 'date',
        dataType: 'date',
      }, {
        dataField: 'amount',
        format: 'currency',
        width: 90,
      }],
    },
    selectAllMode: {
      dataSource: ['allPages', 'page'],
      value: selectAllMode,
      disabled: ko.computed(() => showCheckBoxesMode() === 'none'),
    },
    checkBoxesMode: {
      dataSource: ['none', 'onClick', 'onLongTap', 'always'],
      value: showCheckBoxesMode,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('grid'));
};

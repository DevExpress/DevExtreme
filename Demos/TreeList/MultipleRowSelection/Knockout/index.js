window.onload = function () {
  const recursiveSelectionEnabled = ko.observable(false);
  const selectedRowKeys = ko.observableArray([]);

  recursiveSelectionEnabled.subscribe(() => {
    selectedRowKeys([]);
  });

  const viewModel = {
    treeListOptions: {
      dataSource: employees,
      keyExpr: 'ID',
      parentIdExpr: 'Head_ID',
      showRowLines: true,
      showBorders: true,
      columnAutoWidth: true,
      selectedRowKeys,
      selection: {
        mode: 'multiple',
        recursive: recursiveSelectionEnabled,
      },
      columns: [{
        dataField: 'Full_Name',
      }, {
        dataField: 'Title',
        caption: 'Position',
      }, 'City', 'State',
      {
        dataField: 'Hire_Date',
        dataType: 'date',
        width: 120,
      },
      ],
      expandedRowKeys: [1, 2, 10],
    },
    recursiveOptions: {
      text: 'Recursive Selection',
      value: recursiveSelectionEnabled,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('tree-list-demo'));
};

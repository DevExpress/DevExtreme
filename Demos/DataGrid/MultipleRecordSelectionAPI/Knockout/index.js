window.onload = function () {
  const selectedItemsText = ko.observable('Nobody has been selected');
  const selectedPrefix = ko.observable(null);
  const clearButtonDisabled = ko.observable(true);

  const viewModel = {
    selectedItemsText,
    gridOptions: {
      dataSource: employees,
      keyExpr: 'ID',
      showBorders: true,
      selection: {
        mode: 'multiple',
      },
      columns: [{
        dataField: 'Prefix',
        caption: 'Title',
        width: 70,
      },
      'FirstName',
      'LastName', {
        dataField: 'Position',
        width: 180,
      }, {
        dataField: 'BirthDate',
        dataType: 'date',
        width: 125,
      }, {
        dataField: 'HireDate',
        dataType: 'date',
        width: 125,
      },
      ],
      onSelectionChanged(selectedItems) {
        const data = selectedItems.selectedRowsData;

        if (data.length > 0) {
          selectedItemsText($.map(data, (value) => `${value.FirstName} ${value.LastName}`).join(', '));
        } else { selectedItemsText('Nobody has been selected'); }

        selectedPrefix(null);
        clearButtonDisabled(!data.length);
      },
    },
    selectPrefixOptions: {
      dataSource: ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'],
      placeholder: 'Select title',
      value: selectedPrefix,
      onValueChanged(data) {
        const dataGrid = $('#grid-container').dxDataGrid('instance');

        if (!data.value) { return; }

        if (data.value === 'All') {
          dataGrid.selectAll();
        } else {
          const employeesToSelect = $.map($.grep(dataGrid.option('dataSource'), (item) => item.Prefix === data.value), (item) => item.ID);
          dataGrid.selectRows(employeesToSelect);
        }

        selectedPrefix(data.value);
      },
    },
    clearButtonOptions: {
      text: 'Clear Selection',
      disabled: clearButtonDisabled,
      onClick() {
        $('#grid-container').dxDataGrid('instance').clearSelection();
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('grid'));
};

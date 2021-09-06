$(() => {
  let dataGrid;
  let changedBySelectBox;

  dataGrid = $('#grid-container').dxDataGrid({
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
        $('#selected-items-container').text(
          $.map(data, (value) => `${value.FirstName} ${value.LastName}`).join(', '),
        );
      } else { $('#selected-items-container').text('Nobody has been selected'); }
      if (!changedBySelectBox) { dataGrid.option('toolbar.items[0].options.value', null); }

      changedBySelectBox = false;
      dataGrid.option('toolbar.items[1].options.disabled', !data.length);
    },
    toolbar: {
      items: [
        {
          widget: 'dxSelectBox',
          location: 'before',
          options: {
            dataSource: ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'],
            placeholder: 'Select title',
            width: '150px',
            onValueChanged(data) {
              if (!data.value) { return; }
              changedBySelectBox = true;
              if (data.value == 'All') {
                dataGrid.selectAll();
              } else {
                const employeesToSelect = $.map($.grep(dataGrid.option('dataSource'), (item) => item.Prefix === data.value), (item) => item.ID);
                dataGrid.selectRows(employeesToSelect);
              }
            },
          },
        },
        {
          widget: 'dxButton',
          location: 'before',
          options: {
            text: 'Clear Selection',
            disabled: true,
            onClick() {
              dataGrid.clearSelection();
            },
          },
        },
      ],
    },
  }).dxDataGrid('instance');
});

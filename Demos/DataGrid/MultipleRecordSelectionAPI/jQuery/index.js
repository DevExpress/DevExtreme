$(() => {
  let changedBySelectBox;
  let titleSelectBox;
  let clearSelectionButton;

  const dataGrid = $('#grid-container').dxDataGrid({
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
    }],
    onSelectionChanged(selectedItems) {
      const data = selectedItems.selectedRowsData;
      if (data.length > 0) {
        $('#selected-items-container').text(
          data
            .map((value) => `${value.FirstName} ${value.LastName}`)
            .join(', '),
        );
      } else {
        $('#selected-items-container').text('Nobody has been selected');
      }
      if (!changedBySelectBox) {
        titleSelectBox.option('value', null);
      }

      changedBySelectBox = false;
      clearSelectionButton.option('disabled', !data.length);
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
              if (!data.value) {
                return;
              }

              changedBySelectBox = true;
              if (data.value === 'All') {
                dataGrid.selectAll();
              } else {
                const employeesToSelect = employees
                  .filter((employee) => employee.Prefix === data.value)
                  .map((employee) => employee.ID);
                dataGrid.selectRows(employeesToSelect);
              }
            },
            onInitialized(e) {
              titleSelectBox = e.component;
            },
          },
        },
        {
          widget: 'dxButton',
          location: 'before',
          options: {
            text: 'Clear Selection',
            disabled: true,
            onInitialized(e) {
              clearSelectionButton = e.component;
            },
            onClick() {
              dataGrid.clearSelection();
            },
          },
        },
      ],
    },
  }).dxDataGrid('instance');
});

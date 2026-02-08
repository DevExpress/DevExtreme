$(() => {
  const employeesStore = new DevExpress.data.ArrayStore({
    key: 'ID',
    data: employees,
  });

  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource: employeesStore,
    showBorders: true,
    paging: {
      enabled: false,
    },
    editing: {
      mode: 'cell',
      allowUpdating: true,
      allowAdding: true,
      allowDeleting: true,
    },
    selection: {
      mode: 'multiple',
    },
    columns: [
      {
        dataField: 'Prefix',
        caption: 'Title',
        width: 55,
      },
      'FirstName',
      'LastName', {
        dataField: 'Position',
        width: 170,
      }, {
        dataField: 'StateID',
        caption: 'State',
        width: 125,
        lookup: {
          dataSource: states,
          displayExpr: 'Name',
          valueExpr: 'ID',
        },
      }, {
        dataField: 'BirthDate',
        dataType: 'date',
      },
    ],
    toolbar: {
      items: [
        {
          name: 'addRowButton',
          showText: 'always',
        }, {
          location: 'after',
          widget: 'dxButton',
          options: {
            text: 'Delete Selected Records',
            icon: 'trash',
            disabled: true,
            onClick() {
              dataGrid.getSelectedRowKeys().forEach((key) => {
                employeesStore.remove(key);
              });
              dataGrid.refresh();
            },
          },
        },
      ],
    },
    onSelectionChanged(data) {
      dataGrid.option('toolbar.items[1].options.disabled', !data.selectedRowsData.length);
    },
  }).dxDataGrid('instance');
});

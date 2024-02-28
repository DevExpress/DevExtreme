$(() => {
  let selectedRowIndex = -1;

  $('#action-add').dxSpeedDialAction({
    label: 'Add row',
    icon: 'add',
    index: 1,
    onClick() {
      grid.addRow();
      grid.deselectAll();
    },
  }).dxSpeedDialAction('instance');

  const deleteSDA = $('#action-remove').dxSpeedDialAction({
    icon: 'trash',
    label: 'Delete row',
    index: 2,
    visible: false,
    onClick() {
      grid.deleteRow(selectedRowIndex);
      grid.deselectAll();
    },
  }).dxSpeedDialAction('instance');

  const editSDA = $('#action-edit').dxSpeedDialAction({
    label: 'Edit row',
    icon: 'edit',
    index: 3,
    visible: false,
    onClick() {
      grid.editRow(selectedRowIndex);
      grid.deselectAll();
    },
  }).dxSpeedDialAction('instance');

  const grid = $('#grid').dxDataGrid({
    dataSource: employees,
    showBorders: true,
    keyExpr: 'ID',
    selection: {
      mode: 'single',
    },
    paging: {
      enabled: false,
    },
    editing: {
      mode: 'popup',
      texts: {
        confirmDeleteMessage: '',
      },
    },
    onSelectionChanged(e) {
      selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);

      deleteSDA.option('visible', selectedRowIndex !== -1);
      editSDA.option('visible', selectedRowIndex !== -1);
    },
    columns: [
      {
        dataField: 'Prefix',
        caption: 'Title',
      },
      'FirstName',
      'LastName',
      {
        dataField: 'Position',
        width: 130,
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
        width: 125,
      },
    ],
  }).dxDataGrid('instance');

  $('#direction').dxSelectBox({
    dataSource: ['auto', 'up', 'down'],
    inputAttr: { 'aria-label': 'Direction' },
    value: 'auto',
    onSelectionChanged(e) {
      DevExpress.config({
        floatingActionButtonConfig: directions[e.selectedItem],
      });

      DevExpress.ui.repaintFloatingActionButton();
    },
  });
});

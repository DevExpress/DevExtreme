$(() => {
  const treeList = $('#employees').dxTreeList({
    dataSource: employees,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    columnAutoWidth: true,
    expandedRowKeys: [1, 2, 4, 5],
    onFocusedCellChanging(e) {
      e.isHighlighted = true;
    },
    keyboardNavigation: {
      enterKeyAction: 'moveFocus',
      enterKeyDirection: 'column',
      editOnKeyPress: true,
    },
    editing: {
      mode: 'batch',
      allowUpdating: true,
      startEditAction: 'dblClick',
    },
    columns: [
      'Full_Name',
      {
        dataField: 'Prefix',
        caption: 'Title',
      },
      {
        dataField: 'Title',
        caption: 'Position',
      },
      'City',
      {
        dataField: 'Hire_Date',
        dataType: 'date',
      }],
  }).dxTreeList('instance');

  const enterKeyActions = ['startEdit', 'moveFocus'];
  const enterKeyDirections = ['none', 'column', 'row'];

  $('#editOnKeyPress').dxCheckBox({
    text: 'Edit On Key Press',
    value: true,
    onValueChanged(data) {
      treeList.option('keyboardNavigation.editOnKeyPress', data.value);
    },
  });

  $('#enterKeyAction').dxSelectBox({
    items: enterKeyActions,
    value: enterKeyActions[1],
    inputAttr: { 'aria-label': 'Key Action' },
    onValueChanged(data) {
      treeList.option('keyboardNavigation.enterKeyAction', data.value);
    },
  });

  $('#enterKeyDirection').dxSelectBox({
    items: enterKeyDirections,
    inputAttr: { 'aria-label': 'Key Direction' },
    value: enterKeyDirections[1],
    onValueChanged(data) {
      treeList.option('keyboardNavigation.enterKeyDirection', data.value);
    },
  });
});

$(() => {
  const selectedEmployeesList = $('#selected-employees').dxList({
    width: 400,
    height: 200,
    showScrollbar: 'always',
    itemTemplate(item) {
      return `<div>${item.prefix} ${item.fullName} (${item.position})</div>`;
    },
  }).dxList('instance');

  const treeView = $('#treeview').dxTreeView({
    items: employees,
    width: 340,
    height: 320,
    showCheckBoxesMode: 'normal',
    onSelectionChanged(e) {
      syncSelection(e.component);
    },
    onContentReady(e) {
      syncSelection(e.component);
    },
    itemTemplate(item) {
      return `<div>${item.fullName} (${item.position})</div>`;
    },
  }).dxTreeView('instance');

  function syncSelection(treeViewInstance) {
    const selectedEmployees = treeViewInstance.getSelectedNodes()
      .map((node) => node.itemData);

    selectedEmployeesList.option('items', selectedEmployees);
  }

  $('#showCheckBoxesMode').dxSelectBox({
    items: ['selectAll', 'normal', 'none'],
    inputAttr: { 'aria-label': 'Show Checkboxes Mode' },
    value: 'normal',
    onValueChanged(e) {
      treeView.option('showCheckBoxesMode', e.value);

      if (e.value === 'selectAll') {
        selectionModeSelectBox.option('value', 'multiple');
        recursiveCheckBox.option('disabled', false);
      }
      selectionModeSelectBox.option('disabled', e.value === 'selectAll');
    },
  });

  const selectionModeSelectBox = $('#selectionMode').dxSelectBox({
    items: ['multiple', 'single'],
    value: 'multiple',
    inputAttr: { 'aria-label': 'Selection Mode' },
    onValueChanged(e) {
      treeView.option('selectionMode', e.value);

      if (e.value === 'single') {
        recursiveCheckBox.option('value', false);
        treeView.unselectAll();
      }

      recursiveCheckBox.option('disabled', e.value === 'single');
    },
  }).dxSelectBox('instance');

  const recursiveCheckBox = $('#selectNodesRecursive').dxCheckBox({
    text: 'Select Nodes Recursive',
    value: true,
    onValueChanged(e) {
      treeView.option('selectNodesRecursive', e.value);
    },
  }).dxCheckBox('instance');

  $('#selectByClick').dxCheckBox({
    text: 'Select By Click',
    value: false,
    onValueChanged(e) {
      treeView.option('selectByClick', e.value);
    },
  });
});

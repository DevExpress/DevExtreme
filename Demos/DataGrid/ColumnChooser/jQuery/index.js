const columnChooserModes = [{
  key: 'dragAndDrop',
  name: 'Drag and drop',
}, {
  key: 'select',
  name: 'Select',
}];

$(() => {
  const dataGrid = $('#employees').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    columns: [{
      dataField: 'FirstName',
      allowHiding: false,
    }, 'LastName', 'Position', 'City', 'State', {
      caption: 'Contacts',
      columns: [{
        dataField: 'MobilePhone',
        allowHiding: false,
      }, 'Email', {
        dataField: 'Skype',
        visible: false,
      }],
    }, {
      dataField: 'HireDate',
      dataType: 'date',
    }],
    columnAutoWidth: true,
    showRowLines: true,
    showBorders: true,
    columnChooser: {
      enabled: true,
      mode: columnChooserModes[1].key,
      position: {
        my: 'right top',
        at: 'right bottom',
        of: '.dx-datagrid-column-chooser-button',
      },
      search: {
        enabled: true,
        editorOptions: { placeholder: 'Search column' },
      },
      selection: {
        recursive: true,
        selectByClick: true,
        allowSelectAll: true,
      },
    },
  }).dxDataGrid('instance');

  $('#columnChooserMode').dxSelectBox({
    items: columnChooserModes,
    value: columnChooserModes[1].key,
    inputAttr: { 'aria-label': 'Column Chooser Mode' },
    valueExpr: 'key',
    displayExpr: 'name',
    onValueChanged(data) {
      dataGrid.option('columnChooser.mode', data.value);

      const isDragMode = columnChooserModes[0].key === data.value;

      $('#allowSelectAll').dxCheckBox('instance').option('disabled', isDragMode);
      $('#selectByClick').dxCheckBox('instance').option('disabled', isDragMode);
      $('#recursive').dxCheckBox('instance').option('disabled', isDragMode);
    },
  });

  $('#searchEnabled').dxCheckBox({
    text: 'Search enabled',
    value: true,
    onValueChanged(data) {
      dataGrid.option('columnChooser.search.enabled', data.value);
    },
  });

  $('#allowSelectAll').dxCheckBox({
    text: 'Allow select all',
    value: true,
    onValueChanged(data) {
      dataGrid.option('columnChooser.selection.allowSelectAll', data.value);
    },
  });

  $('#selectByClick').dxCheckBox({
    text: 'Select by click',
    value: true,
    onValueChanged(data) {
      dataGrid.option('columnChooser.selection.selectByClick', data.value);
    },
  });

  $('#recursive').dxCheckBox({
    text: 'Recursive',
    value: true,
    onValueChanged(data) {
      dataGrid.option('columnChooser.selection.recursive', data.value);
    },
  });
});

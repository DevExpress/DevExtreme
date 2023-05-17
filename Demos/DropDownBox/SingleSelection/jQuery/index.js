$(() => {
  let treeView; let
    dataGrid;

  const syncTreeViewSelection = function (treeViewInstance, value) {
    if (!value) {
      treeViewInstance.unselectAll();
    } else {
      treeViewInstance.selectItem(value);
    }
  };

  const makeAsyncDataSource = function (jsonFile) {
    return new DevExpress.data.CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load() {
        return $.getJSON(`../../../../data/${jsonFile}`);
      },
    });
  };

  $('#treeBox').dxDropDownBox({
    value: '1_1',
    valueExpr: 'ID',
    displayExpr: 'name',
    placeholder: 'Select a value...',
    showClearButton: true,
    inputAttr: { 'aria-label': 'Owner' },
    dataSource: makeAsyncDataSource('treeProducts.json'),
    contentTemplate(e) {
      const $treeView = $('<div>').dxTreeView({
        dataSource: e.component.getDataSource(),
        dataStructure: 'plain',
        keyExpr: 'ID',
        parentIdExpr: 'categoryId',
        selectionMode: 'single',
        displayExpr: 'name',
        selectByClick: true,
        onContentReady(args) {
          const value = e.component.option('value');
          syncTreeViewSelection(args.component, value);
        },
        selectNodesRecursive: false,
        onItemSelectionChanged(args) {
          const selectedKeys = args.component.getSelectedNodeKeys();
          e.component.option('value', selectedKeys);
        },
      });

      treeView = $treeView.dxTreeView('instance');

      e.component.on('valueChanged', (args) => {
        syncTreeViewSelection(treeView, args.value);
        e.component.close();
      });

      return $treeView;
    },
  });

  $('#gridBox').dxDropDownBox({
    value: 3,
    valueExpr: 'ID',
    deferRendering: false,
    placeholder: 'Select a value...',
    inputAttr: { 'aria-label': 'Owner' },
    displayExpr(item) {
      return item && `${item.CompanyName} <${item.Phone}>`;
    },
    showClearButton: true,
    dataSource: makeAsyncDataSource('customers.json'),
    contentTemplate(e) {
      const value = e.component.option('value');
      const $dataGrid = $('<div>').dxDataGrid({
        dataSource: e.component.getDataSource(),
        columns: ['CompanyName', 'City', 'Phone'],
        hoverStateEnabled: true,
        paging: { enabled: true, pageSize: 10 },
        filterRow: { visible: true },
        scrolling: { mode: 'virtual' },
        selection: { mode: 'single' },
        selectedRowKeys: [value],
        height: '100%',
        onSelectionChanged(selectedItems) {
          const keys = selectedItems.selectedRowKeys;
          const hasSelection = keys.length;

          e.component.option('value', hasSelection ? keys[0] : null);
        },
      });

      dataGrid = $dataGrid.dxDataGrid('instance');

      e.component.on('valueChanged', (args) => {
        dataGrid.selectRows(args.value, false);
        e.component.close();
      });

      return $dataGrid;
    },
  });
});

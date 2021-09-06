$(() => {
  let treeView; let
    dataGrid;

  const syncTreeViewSelection = function (treeView, value) {
    if (!value) {
      treeView.unselectAll();
      return;
    }

    value.forEach((key) => {
      treeView.selectItem(key);
    });
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
    value: ['1_1'],
    valueExpr: 'ID',
    displayExpr: 'name',
    placeholder: 'Select a value...',
    showClearButton: true,
    dataSource: makeAsyncDataSource('treeProducts.json'),
    contentTemplate(e) {
      const value = e.component.option('value');
      const $treeView = $('<div>').dxTreeView({
        dataSource: e.component.getDataSource(),
        dataStructure: 'plain',
        keyExpr: 'ID',
        parentIdExpr: 'categoryId',
        selectionMode: 'multiple',
        displayExpr: 'name',
        selectByClick: true,
        onContentReady(args) {
          syncTreeViewSelection(args.component, value);
        },
        selectNodesRecursive: false,
        showCheckBoxesMode: 'normal',
        onItemSelectionChanged(args) {
          const selectedKeys = args.component.getSelectedNodeKeys();
          e.component.option('value', selectedKeys);
        },
      });

      treeView = $treeView.dxTreeView('instance');

      e.component.on('valueChanged', (args) => {
        const { value } = args;
        syncTreeViewSelection(treeView, value);
      });

      return $treeView;
    },
  });

  $('#gridBox').dxDropDownBox({
    value: [3],
    valueExpr: 'ID',
    placeholder: 'Select a value...',
    displayExpr: 'CompanyName',
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
        height: 345,
        selection: { mode: 'multiple' },
        selectedRowKeys: value,
        onSelectionChanged(selectedItems) {
          const keys = selectedItems.selectedRowKeys;
          e.component.option('value', keys);
        },
      });

      dataGrid = $dataGrid.dxDataGrid('instance');

      e.component.on('valueChanged', (args) => {
        const { value } = args;
        dataGrid.selectRows(value, false);
      });

      return $dataGrid;
    },
  });
});

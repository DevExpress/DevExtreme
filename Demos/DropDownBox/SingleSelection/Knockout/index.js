window.onload = function () {
  let treeView;

  const syncTreeViewSelection = function (treeViewInstance, value) {
    if (!treeViewInstance) return;

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

  const getSelectedItemsKeys = function (items) {
    let result = [];
    items.forEach((item) => {
      if (item.selected) {
        result.push(item.key);
      }
      if (item.items.length) {
        result = result.concat(getSelectedItemsKeys(item.items));
      }
    });
    return result;
  };

  const treeDataSource = makeAsyncDataSource('treeProducts.json');
  const gridDataSource = makeAsyncDataSource('customers.json');
  const isTreeBoxOpened = ko.observable(false);

  const treeBoxOptions = {
    value: ko.observable('1_1'),
    valueExpr: 'ID',
    opened: isTreeBoxOpened,
    displayExpr: 'name',
    placeholder: 'Select a value...',
    showClearButton: true,
    dataSource: treeDataSource,
    treeView: {
      dataSource: treeDataSource,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      selectionMode: 'single',
      onContentReady(e) {
        treeView = e.component;

        syncTreeViewSelection(treeView, treeBoxOptions.value());
      },
      onItemSelectionChanged(args) {
        const nodes = args.component.getNodes();
        const value = getSelectedItemsKeys(nodes);

        treeBoxOptions.value(value);
      },
      onItemClick() {
        isTreeBoxOpened(false);
      },
      displayExpr: 'name',
      selectByClick: true,
      selectNodesRecursive: false,
    },
  };

  const gridBoxValue = ko.observable(3);
  const isGridBoxOpened = ko.observable(false);

  const gridBoxOptions = {
    value: gridBoxValue,
    opened: isGridBoxOpened,
    valueExpr: 'ID',
    deferRendering: false,
    placeholder: 'Select a value...',
    displayExpr(item) {
      return item && `${item.CompanyName} <${item.Phone}>`;
    },
    showClearButton: true,
    dataSource: gridDataSource,
    dataGrid: {
      dataSource: gridDataSource,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      selection: { mode: 'single' },
      height: '100%',
      selectedRowKeys: ko.computed(() => {
        const editorValue = gridBoxValue();
        return (editorValue && [editorValue]) || [];
      }),
      onSelectionChanged(selectedItems) {
        const hasSelection = selectedItems.selectedRowKeys.length;
        gridBoxValue(hasSelection ? selectedItems.selectedRowKeys[0] : null);
        isGridBoxOpened(false);
      },
    },
  };

  ko.computed(() => {
    syncTreeViewSelection(treeView, treeBoxOptions.value());
  });

  const viewModel = {
    treeBoxOptions,
    gridBoxOptions,
  };

  ko.applyBindings(viewModel, document.getElementById('dropdown-box-demo'));
};

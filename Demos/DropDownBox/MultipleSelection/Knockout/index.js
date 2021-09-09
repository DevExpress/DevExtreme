window.onload = function () {
  let treeView;

  const syncTreeViewSelection = function (treeViewInstance, value) {
    if (!treeViewInstance) return;

    if (!value) {
      treeViewInstance.unselectAll();
      return;
    }

    value.forEach((key) => {
      treeViewInstance.selectItem(key);
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

  const treeBoxOptions = {
    value: ko.observable(['1_1']),
    valueExpr: 'ID',
    displayExpr: 'name',
    placeholder: 'Select a value...',
    showClearButton: true,
    dataSource: treeDataSource,
    treeView: {
      dataSource: treeDataSource,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      selectionMode: 'multiple',
      onContentReady(e) {
        treeView = e.component;
        syncTreeViewSelection(treeView, treeBoxOptions.value());
      },
      onItemSelectionChanged(args) {
        const nodes = args.component.getNodes();
        const value = getSelectedItemsKeys(nodes);

        treeBoxOptions.value(value);
      },
      displayExpr: 'name',
      selectByClick: true,
      selectNodesRecursive: false,
      showCheckBoxesMode: 'normal',
    },
  };

  const gridBoxValue = ko.observable([3]);

  const gridBoxOptions = {
    value: gridBoxValue,
    valueExpr: 'ID',
    placeholder: 'Select a value...',
    displayExpr: 'CompanyName',
    showClearButton: true,
    dataSource: gridDataSource,
    dataGrid: {
      dataSource: gridDataSource,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      height: 345,
      selection: { mode: 'multiple' },
      selectedRowKeys: ko.computed(() => gridBoxValue() || []),
      onSelectionChanged(selectedItems) {
        gridBoxValue(selectedItems.selectedRowKeys);
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

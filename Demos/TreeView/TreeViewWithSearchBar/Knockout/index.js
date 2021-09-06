window.onload = function () {
  const searchMode = ko.observable('contains');

  const viewModel = {
    treeViewOptions: {
      items: products,
      width: 500,
      searchEnabled: true,
      searchMode,
    },
    searchModeOptions: {
      dataSource: ['contains', 'startsWith'],
      value: searchMode,
    },
  };

  ko.applyBindings(viewModel);
};

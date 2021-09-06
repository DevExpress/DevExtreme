window.onload = function () {
  const searchMode = ko.observable('contains');

  const viewModel = {
    listOptions: {
      dataSource: products,
      height: 400,
      searchEnabled: true,
      searchExpr: 'Name',
      searchMode,
      itemTemplate(data) {
        return $('<div>').text(data.Name);
      },
    },
    searchModeOptions: {
      dataSource: ['contains', 'startsWith', 'equals'],
      value: searchMode,
    },
  };

  ko.applyBindings(viewModel);
};

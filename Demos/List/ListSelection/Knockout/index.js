window.onload = function () {
  const selectedItemKeys = ko.observable([]);
  const selectionMode = ko.observable('all');
  const selectAllMode = ko.observable('page');

  const viewModel = {
    listOptions: {
      dataSource: new DevExpress.data.DataSource({
        store: new DevExpress.data.ArrayStore({
          key: 'id',
          data: tasks,
        }),
      }),
      height: 400,
      showSelectionControls: true,
      selectionMode,
      selectAllMode,
      selectedItemKeys,
    },
    selectAllModeOptions: {
      items: ['page', 'allPages'],
      disabled: ko.computed(() => selectionMode() !== 'all'),
      value: selectAllMode,
    },
    selectionModeOptions: {
      items: ['none', 'single', 'multiple', 'all'],
      value: selectionMode,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('list-demo'));
};

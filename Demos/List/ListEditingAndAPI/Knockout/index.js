window.onload = function () {
  const itemDeleteMode = ko.observable('toggle');
  const allowDeletion = ko.observable(false);

  const viewModel = {
    listOptions: {
      dataSource: tasks,
      height: 400,
      allowItemDeleting: allowDeletion,
      itemDeleteMode,
    },
    itemDeleteModeOptions: {
      dataSource: ['static', 'toggle', 'slideButton', 'slideItem', 'swipe', 'context'],
      disabled: ko.computed(() => !allowDeletion()),
      value: itemDeleteMode,
    },
    allowDeletionOptions: {
      value: allowDeletion,
      text: 'Allow deletion',
    },
  };

  ko.applyBindings(viewModel, document.getElementById('list-api-demo'));
};

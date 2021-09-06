window.onload = function () {
  const viewModel = {
    listOptions: {
      dataSource: employees,
      height: '100%',
      grouped: true,
      collapsibleGroups: true,
      groupTemplate(data) {
        return $(`<div>Assigned: ${data.key}</div>`);
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('list'));
};

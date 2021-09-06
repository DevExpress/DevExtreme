window.onload = function () {
  const viewModel = {
    selectedEmployee: ko.observable(),
    lookupOptions: {
      items: employees,
      displayExpr(item) {
        if (!item) {
          return '';
        }

        return `${item.FirstName} ${item.LastName}`;
      },
      dropDownOptions: {
        showTitle: false,
      },
      placeholder: 'Select employee',
      onValueChanged(e) {
        e.model.selectedEmployee(e.value);
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('demo'));
};

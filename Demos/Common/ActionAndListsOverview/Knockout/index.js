window.onload = function () {
  const currentHotel = ko.observable(data[0]);

  const viewModel = {
    dataSource,
    currentHotel,
    listSelectionChanged(e) {
      currentHotel(e.addedItems[0]);
    },
  };

  ko.applyBindings(viewModel, document.getElementById('overview'));
};

window.onload = function () {
  const viewModel = {
    products,
    checkAvailable(data) {
      const type = data.value ? 'success' : 'error';
      const productName = data.element.parent().find('#name').text();
      const text = productName
                    + (data.value ? ' is available' : ' is not available');

      DevExpress.ui.notify(text, type, 600);
    },
  };

  ko.applyBindings(viewModel, document.getElementById('toast'));
};

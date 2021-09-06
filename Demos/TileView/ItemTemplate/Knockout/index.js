window.onload = function () {
  DevExpress.setTemplateEngine('underscore');

  const viewModel = {
    tileViewOptions: {
      items: homes,
      height: 390,
      baseItemHeight: 120,
      baseItemWidth: 185,
      itemMargin: 10,
    },
    formatCurrency: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format,
  };

  ko.applyBindings(viewModel, document.getElementById('demo'));
};

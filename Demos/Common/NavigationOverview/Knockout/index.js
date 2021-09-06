window.onload = function () {
  const countryData = ko.observable(continents[0].items[0]);
  const citiesData = ko.observableArray(countryData().cities);
  const tabPanelIndex = ko.observable(0);

  const viewModel = {
    countryData,
    treeViewOptions: {
      dataSource: continents,
      selectionMode: 'single',
      selectByClick: true,
      onItemSelectionChanged(e) {
        const currentCountryData = e.itemData;
        if (currentCountryData.cities) {
          countryData(currentCountryData);
          citiesData(currentCountryData.cities);
          tabPanelIndex(0);
        }
      },
    },
    tabPanelOptions: {
      dataSource: citiesData,
      animationEnabled: true,
      selectedIndex: tabPanelIndex,
      itemTitleTemplate: 'title',
      itemTemplate: 'city-template',
    },
  };

  ko.applyBindings(viewModel, document.getElementById('overview'));
};

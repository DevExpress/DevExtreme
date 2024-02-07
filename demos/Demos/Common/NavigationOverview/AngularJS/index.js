const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.countryData = continents[0].items[0];
  $scope.citiesData = $scope.countryData.cities;
  $scope.tabPanelIndex = 0;

  $scope.treeViewOptions = {
    dataSource: continents,
    selectionMode: 'single',
    selectByClick: true,
    onItemSelectionChanged(e) {
      const countryData = e.itemData;
      if (countryData.cities) {
        $scope.countryData = countryData;
        $scope.citiesData = countryData.cities;
        $scope.tabPanelIndex = 0;
      }
    },
  };

  $scope.tabPanelOptions = {
    bindingOptions: {
      dataSource: 'citiesData',
      selectedIndex: 'tabPanelIndex',
    },
    animationEnabled: true,
    itemTitleTemplate: 'title',
    itemTemplate: 'city-template',
  };
});

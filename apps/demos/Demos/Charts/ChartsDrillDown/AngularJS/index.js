const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope, $element) => {
  $scope.dataSource = filterData('');
  $scope.isFirstLevel = true;

  $scope.chartOptions = {
    bindingOptions: {
      dataSource: 'dataSource',
    },
    title: 'The Most Populated Countries by Continents',
    series: {
      type: 'bar',
    },
    legend: {
      visible: false,
    },
    valueAxis: {
      showZero: false,
    },
    onPointClick(e) {
      if ($scope.isFirstLevel) {
        $scope.isFirstLevel = false;
        removePointerCursor($element);
        $scope.dataSource = filterData(e.target.originalArgument);
      }
    },
    customizePoint() {
      const pointSettings = {
        color: colors[Number($scope.isFirstLevel)],
      };

      if (!$scope.isFirstLevel) {
        pointSettings.hoverStyle = {
          hatching: 'none',
        };
      }

      return pointSettings;
    },
  };
  $scope.buttonOptions = {
    text: 'Back',
    icon: 'chevronleft',
    bindingOptions: {
      visible: '!isFirstLevel',
    },
    onClick() {
      if (!$scope.isFirstLevel) {
        $scope.isFirstLevel = true;
        addPointerCursor($element);
        $scope.dataSource = filterData('');
      }
    },
  };

  addPointerCursor($element);
});

function filterData(name) {
  return data.filter((item) => item.parentID === name);
}

function addPointerCursor(element) {
  element.find('#chart').addClass('pointer-on-bars');
}

function removePointerCursor(element) {
  element.find('#chart').removeClass('pointer-on-bars');
}

const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.treeMapOptions = {
    dataSource: citiesPopulation,
    size: {
      height: 440,
    },
    title: {
      text: 'The Most Populated Cities by Continents',
      placeholderSize: 80,
    },
    colorizer: {
      palette: 'soft',
    },
    interactWithGroup: true,
    maxDepth: 2,
    onClick(e) {
      e.node.drillDown();
    },
    onDrill(e) {
      let node;
      $scope.markup = [];
      for (node = e.node.getParent(); node; node = node.getParent()) {
        $scope.markup.unshift({
          text: (node.label() || 'All Continents'),
          node,
        });
      }
      if ($scope.markup.length) {
        $scope.markup.push({
          text: e.node.label(),
          node: e.node,
        });
      }
    },
  };

  $scope.onLinkClick = function () {
    this.label.node.drillDown();
  };
});

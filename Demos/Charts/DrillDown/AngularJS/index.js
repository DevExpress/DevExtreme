var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.treeMapOptions = {
        dataSource: citiesPopulation,
        size: {
            height: 440
        },
        title: {
            text: "The Most Populated Cities by Continents",
            placeholderSize: 80
        },
        colorizer: {
            palette: "soft"
        },
        interactWithGroup: true,
        maxDepth: 2,
        onClick: function(e) {
            e.node.drillDown();
        },
        onDrill: function(e) {
            var node;
            $scope.markup = [];
            for (node = e.node.getParent(); node; node = node.getParent()) {
                $scope.markup.unshift({
                    text: (node.label() || "All Continents"),
                    node: node
                });
            }
            if ($scope.markup.length) {
                $scope.markup.push({
                    text: e.node.label(),
                    node: e.node
                });
            }
        }
    };
    
    $scope.onLinkClick = function() {
        this.label.node.drillDown();
    };
});
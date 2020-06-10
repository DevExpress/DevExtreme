var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {    
    $scope.tileViewOptions = {
        items: homes,
        itemTemplate: function (itemData, itemIndex, itemElement) {
            itemElement.append("<div class=\"image\" style=\"background-image: url("+ itemData.ImageSrc + ")\"></div>");
        }
    };
});
const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.tileViewOptions = {
    items: homes,
    itemTemplate(itemData, itemIndex, itemElement) {
      itemElement.append(`<div class="image" style="background-image: url(${itemData.ImageSrc})"></div>`);
    },
  };
});

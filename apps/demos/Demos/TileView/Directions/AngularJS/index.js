const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.direction = 'horizontal';

  $scope.tileViewOptions = {
    items: homes,
    height: 390,
    baseItemHeight: 120,
    baseItemWidth: 185,
    width: '100%',
    itemMargin: 10,
    itemTemplate(itemData, itemIndex, itemElement) {
      const $image = $('<div>')
        .addClass('image')
        .css('background-image', `url(${itemData.ImageSrc})`);

      itemElement.append($image);
    },
    bindingOptions: {
      direction: 'direction',
    },
  };

  $scope.directionOptions = {
    items: ['horizontal', 'vertical'],
    value: $scope.direction,
    onValueChanged(e) {
      $scope.direction = e.value;
    },
  };
});

const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.defaultModeOptions = {
    target: '#product1',
    showEvent: 'mouseenter',
    hideEvent: 'mouseleave',
    hideOnOutsideClick: false,
  };

  $scope.withTemplateOptions = {
    target: '#product2',
    showEvent: 'mouseenter',
    hideEvent: 'mouseleave',
    hideOnOutsideClick: false,
    position: 'right',
    contentTemplate(data) {
      data.html("<img alt='SuperPlasma 50' width='150' src='../../../../images/products/3.png'><br/><b>SuperPlasma 50</b><br/>2400$");
    },
  };

  $scope.withAnimationOptions = {
    target: '#product3',
    showEvent: 'mouseenter',
    hideEvent: 'mouseleave',
    hideOnOutsideClick: false,
    position: 'top',
    animation: {
      show: {
        type: 'slide',
        from: {
          top: -100,
          opacity: 0,
        },
        to: {
          opacity: 1,
          top: 0,
        },
      },
      hide: {
        type: 'pop',
        from: {
          scale: 1,
          opacity: 1,
        },
        to: {
          opacity: 0,
          scale: 0.1,
        },
      },
    },
  };
});

const DemoApp = angular.module('DemoApp', ['dx', 'ngSanitize']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.text = text;
  $scope.elementAttr = {
    class: 'panel-list dx-theme-accent-as-background-color',
  };
  $scope.navigation = navigation;
  $scope.selectedRevealMode = 'slide';
  $scope.selectedOpenMode = 'shrink';
  $scope.selectedPosition = 'left';

  let drawerInstance;
  $scope.drawerOptions = {
    bindingOptions: {
      openedStateMode: 'selectedOpenMode',
      position: 'selectedPosition',
      revealMode: 'selectedRevealMode',
    },
    opened: true,
    height: 400,
    closeOnOutsideClick: true,
    template: 'listTemplate',
    onInitialized(e) {
      drawerInstance = e.component;
    },
  };

  $scope.toolbarOptions = {
    items: [{
      widget: 'dxButton',
      location: 'before',
      options: {
        icon: 'menu',
        onClick() {
          drawerInstance.toggle();
        },
      },
    }],
  };

  $scope.showModes = {
    items: ['push', 'shrink', 'overlap'],
    layout: 'horizontal',
    bindingOptions: { value: 'selectedOpenMode' },
  };

  $scope.positionModes = {
    items: ['left', 'right'],
    layout: 'horizontal',
    bindingOptions: { value: 'selectedPosition' },
  };

  $scope.showSubmenuModes = {
    items: ['slide', 'expand'],
    layout: 'horizontal',
    bindingOptions: { value: 'selectedRevealMode' },
  };
});

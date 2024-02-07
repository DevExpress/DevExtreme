const DemoApp = angular.module('DemoApp', ['dx', 'ngSanitize']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.text = text;
  $scope.elementAttr = { class: 'panel-list dx-theme-accent-as-background-color' };
  $scope.navigation = navigation;
  $scope.selectedRevealMode = 'expand';
  $scope.selectedOpenMode = 'shrink';
  $scope.selectedPosition = 'top';

  let drawerInstance;
  $scope.drawerOptions = {
    bindingOptions: {
      openedStateMode: 'selectedOpenMode',
      position: 'selectedPosition',
      revealMode: 'selectedRevealMode',
    },
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
    bindingOptions: { value: 'selectedOpenMode' },
    items: ['push', 'shrink', 'overlap'],
    layout: 'horizontal',
  };

  $scope.positionModes = {
    bindingOptions: { value: 'selectedPosition' },
    items: ['top', 'bottom'],
    layout: 'horizontal',
  };

  $scope.showSubmenuModes = {
    bindingOptions: { value: 'selectedRevealMode' },
    items: ['slide', 'expand'],
    layout: 'horizontal',
  };
});

const DemoApp = angular.module('DemoApp', ['dx', 'ngSanitize']);

DemoApp.controller('DemoController', function($scope) {
    $scope.text = text;
    $scope.elementAttr = { class: 'panel-list dx-theme-accent-as-background-color' };
    $scope.navigation = navigation;
    $scope.selectedRevealMode = "expand";
    $scope.selectedOpenMode = "shrink";
    $scope.selectedPosition = "top";

    var drawerInstance;
    $scope.drawerOptions = {
        bindingOptions: {
            openedStateMode: "selectedOpenMode",
            position: "selectedPosition",
            revealMode: "selectedRevealMode"
        },
        height: 400,
        closeOnOutsideClick: true,
        template: "listTemplate",
        onInitialized: function(e) {
            drawerInstance = e.component;
        }
    };

    $scope.toolbarOptions = {
        items: [{
            widget: "dxButton",
            location: "before",
            options: {
                icon: "menu",
                onClick: function() {
                    drawerInstance.toggle();
                }
            }
        }]
    };

    $scope.showModes = {
        bindingOptions: { value: "selectedOpenMode" },
        items: ["push", "shrink", "overlap"],
        layout: "horizontal"
    };

    $scope.positionModes = {
        bindingOptions: { value: "selectedPosition" },
        items: ["top", "bottom"],
        layout: "horizontal"
    };

    $scope.showSubmenuModes = {
        bindingOptions: { value: "selectedRevealMode" },
        items: ["slide", "expand"],
        layout: "horizontal",
    };
});
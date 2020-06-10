const DemoApp = angular.module("DemoApp", ["dx", "ngSanitize"]);

DemoApp.controller("DemoController", function($scope) {
    $scope.text = text;
    $scope.elementAttr = {
        class: "panel-list dx-theme-accent-as-background-color"
    };
    $scope.navigation = navigation;
    $scope.selectedRevealMode = "slide";
    $scope.selectedOpenMode =  "shrink";
    $scope.selectedPosition = "left";
    
    var drawerInstance;
    $scope.drawerOptions = {
        bindingOptions: {
            openedStateMode: "selectedOpenMode",
            position: "selectedPosition",
            revealMode: "selectedRevealMode"
        },
        opened: true,
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
        items: ["push", "shrink", "overlap"],
        layout: "horizontal",
        bindingOptions: { value: "selectedOpenMode" }
    };

    $scope.positionModes = {
        items: ["left", "right"],
        layout: "horizontal",
        bindingOptions: { value: "selectedPosition" }
    };

    $scope.showSubmenuModes = {
        items: ["slide", "expand"],
        layout: "horizontal",
        bindingOptions: { value: "selectedRevealMode" }
    };
});

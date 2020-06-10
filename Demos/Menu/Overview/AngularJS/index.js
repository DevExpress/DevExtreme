var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var showSubmenuModes = [{
        name: "onHover",
        delay: { show: 0, hide: 500 }
    }, {
        name: "onClick",
        delay: { show: 0, hide: 300 }
    }];

    $scope.showFirstSubmenuMode = showSubmenuModes[1];
    $scope.orientation = "horizontal";
    $scope.submenuDirection = "auto";
    $scope.closeOnMouseLeave = false;

    $scope.productName = "",
    $scope.productPrice = "",
    $scope.productImage = "";
    
    $scope.menuOptions = {
        dataSource: menuData,
        displayExpr: "name",
        onItemClick: function (data) {
            var item = data.itemData;
            if(item.price) {
                $scope.productName = item.name;
                $scope.productPrice = "$" + item.price;
                $scope.productImage = item.icon;
            }
        },
        bindingOptions: {
            showFirstSubmenuMode: "showFirstSubmenuMode",
            orientation: "orientation",
            submenuDirection: "submenuDirection",
            hideSubmenuOnMouseLeave: "closeOnMouseLeave"
        }
    };
    
    $scope.submenuModeOptions = {
        items: showSubmenuModes,
        displayExpr: "name",
        bindingOptions: {
            value: "showFirstSubmenuMode"
        }
    };

    $scope.orientationOptions = {
        items: ["horizontal", "vertical"],
        bindingOptions: {
            value: "orientation"
        }
    };
    
    $scope.submenuDirectionOptions = {
        items: ["auto", "rightOrBottom", "leftOrTop"],
        bindingOptions: {
            value: "submenuDirection"
        }
    };
    
    $scope.mouseLeaveOptions = {
        text: "Hide Submenu on Mouse Leave",
        bindingOptions: {
            value: "closeOnMouseLeave"
        }
    };
    
    
});
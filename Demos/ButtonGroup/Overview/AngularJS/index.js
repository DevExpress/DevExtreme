var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.singleButtonGroupOptions = {
        items: alignments,
        keyExpr: "alignment",
        stylingMode: "outlined",
        selectedItemKeys: ["left"],
        onItemClick: function(e){
            DevExpress.ui.notify({ message: 'The "' + e.itemData.hint + '" button was clicked', width: 320 }, "success", 1000);
        }
    };

    $scope.multipleButtonGroupOptions = {
        items: fontStyles,
        keyExpr: "style",
        stylingMode: "outlined",
        selectionMode: "multiple",
        onItemClick: function(e){
            DevExpress.ui.notify({ message: 'The "' + e.itemData.hint + '" button was clicked', width: 320 }, "success", 1000);
        }
    };

    $scope.singleStylingModeButtonGroupOptions = {
        items: alignments,
        keyExpr: "alignment",
        stylingMode: "text",
        selectedItemKeys: ["left"],
        onItemClick: function(e){
            DevExpress.ui.notify({ message: 'The "' + e.itemData.hint + '" button was clicked', width: 320 }, "success", 1000);
        }
    };

    $scope.multipleStylingModeButtonGroupOptions = {
        items: fontStyles,
        keyExpr: "style",
        stylingMode: "text",
        selectionMode: "multiple",
        onItemClick: function(e){
            DevExpress.ui.notify({ message: 'The "' + e.itemData.hint + '" button was clicked', width: 320 }, "success", 1000);
        }
    };
});

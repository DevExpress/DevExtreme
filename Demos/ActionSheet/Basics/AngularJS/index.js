var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var showNotify = function(value) {
        DevExpress.ui.notify("The \"" + value + "\" button is clicked.");
    }; 
    $scope.actionSheetVisible = false;
    $scope.showTitleValue = true;
    $scope.showCancelButtonValue = true;
    
    $scope.actionSheetOptions = {
        dataSource: actionSheetItems,
        title: "Choose action",
        onCancelClick: function() {
            showNotify("Cancel");
        },
        onItemClick: function(value) {
            showNotify(value.itemData.text);
        },  
        bindingOptions: {
            visible: "actionSheetVisible",
            showTitle: "showTitleValue",
            showCancelButton: "showCancelButtonValue"
    
        }
    };

    $scope.buttonOptions = {
        text: "Click to show Action Sheet",
        onClick: function() {
            $scope.actionSheetVisible = true;
        }
    };
 
});
var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {    
    var initData;
    $scope.actionSheetVisible = false;
    
    $scope.actionSheetOptions = {
	    dataSource: actionSheetItems,
	    title: "Choose action",
	    usePopover: true,
        onInitialized: function(e) {
            initData = e.component;
        },
        onItemClick: function(value) {
            DevExpress.ui.notify("The \"" + value.itemData.text + "\" button is clicked.");
        },
	    bindingOptions: {
            visible: "actionSheetVisible"
        }
	};
    
    $scope.listOptions = {
	    dataSource: contacts,
	    onItemClick: function(e) {
            initData.option("target", e.itemElement);
	    	$scope.actionSheetTarget = e.itemElement;        
            $scope.actionSheetVisible = true;
	    }
	};

}); 
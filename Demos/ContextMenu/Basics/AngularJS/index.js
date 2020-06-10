var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {    
    $scope.contextMenuOptions = {
        dataSource: contextMenuItems,
        width: 200,
        target: "#image",
	    onItemClick: function(e){
			if (!e.itemData.items) {
	        	DevExpress.ui.notify("The \"" + e.itemData.text + "\" item was clicked", "success", 1500);
	        }
	    }
    };    
});
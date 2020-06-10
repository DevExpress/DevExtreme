var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.selectedEmployee = "none";
        
    $scope.lookupOptions = {
        items: employees,
        displayExpr: function(item) {
            if(!item) {
                return "";
            }

            return item.FirstName + " " + item.LastName;
        },
        dropDownOptions: {
            showTitle: false
        },
	    placeholder: "Select employee",
        onValueChanged: function(data) {
            $scope.selectedEmployee = data.value;
        }
    };
});
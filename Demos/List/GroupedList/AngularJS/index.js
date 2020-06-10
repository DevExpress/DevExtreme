var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.listOptions = {
        dataSource: employees,
        height: "100%",
        grouped: true,
        collapsibleGroups: true,
        groupTemplate: function(data) {
            return $("<div>Assigned: " + data.key + "</div>");
    
        }
    }; 
});
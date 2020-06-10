var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.dataGridOptions = {
        dataSource: "../../../../data/customers.json",
        columns: ["CompanyName", "City", "State", "Phone", "Fax"],
        showBorders: true
    };
});
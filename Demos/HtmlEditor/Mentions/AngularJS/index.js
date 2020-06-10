var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.htmlEditorOptions = {
        mentions: [{
            dataSource: employees,
            searchExpr: "text",
            displayExpr: "text",
            valueExpr: "text"
        }]
    };
});

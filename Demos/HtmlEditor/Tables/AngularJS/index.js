var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.htmlEditorOptions = {
        height: 350,
        toolbar: {
            items: [
                {
                    name: "header",
                    acceptedValues: [false, 1, 2, 3]
                },
                "separator", "bold", "color", "separator",
                "alignLeft", "alignCenter", "alignRight", "separator",
                "insertTable", "deleteTable",
                "insertRowAbove", "insertRowBelow", "deleteRow",
                "insertColumnLeft", "insertColumnRight", "deleteColumn"
            ]
        }
    };
});

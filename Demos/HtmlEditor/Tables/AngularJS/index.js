var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.htmlEditorOptions = {
        height: 350,
        toolbar: {
            items: [
                {
                    formatName: "header",
                    formatValues: [false, 1, 2, 3] 
                },
                "separator", "bold", "color", "separator",
                "alignLeft", "alignCenter", "alignRight", "separator",
                "insertTable", "insertRowAbove", "insertRowBelow", "insertColumnLeft", "insertColumnRight",
                "deleteRow", "deleteColumn", "deleteTable"
            ]
        }
    };
});

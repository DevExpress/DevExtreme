var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.color = '#f05b41';
    $scope.text = 'UI Superhero';
    $scope.width = 370;
    $scope.height = 260;
    $scope.transform = 'scaleX(1)';
    $scope.border = false;

    $scope.$watch('width', function(width) {
        $scope.height = width*26/37;
    });

    $scope.$watch('height', function(height) {
        $scope.width = height*37/26;
    });

    $scope.transformations = [
        {
            key: "Flip",
            items: [ 
                { name: "0 degrees", value: "scaleX(1)" }, 
                { name: "180 degrees", value: "scaleX(-1)" }
            ]
        },
        {
            key: "Rotate",
            items: [
                { name: "0 degrees", value: "rotate(0)" },
                { name: "15 degrees", value: "rotate(15deg)" },
                { name: "30 degrees", value: "rotate(30deg)" },
                { name: "-15 degrees", value: "rotate(-15deg)" },
                { name: "-30 degrees", value: "rotate(-30deg)" }
            ]
        }
    ];
});

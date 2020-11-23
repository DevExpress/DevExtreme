var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.multiple = false;
    $scope.accept = "*";
    $scope.value = [];
    $scope.uploadMode = "instantly";
    
    $scope.options = {
        uploadUrl: "https://js.devexpress.com/Demos/NetCore/FileUploader/Upload",
        bindingOptions: {
            multiple: "multiple",
            accept: "accept",
            value: "value",
            uploadMode: "uploadMode"
        }
    };
    
    $scope.acceptOptions = {
        dataSource: [
            {name: "All types", value: "*"}, 
            {name: "Images", value: "image/*"}, 
            {name: "Videos", value: "video/*"}
        ],
        valueExpr: "value",
        displayExpr: "name",
        bindingOptions: {
            value: "accept"
        }
    };
    
    $scope.uploadOptions = {
        items: ["instantly", "useButtons"],
        bindingOptions: {
            value: "uploadMode"
        }
    };
    
});
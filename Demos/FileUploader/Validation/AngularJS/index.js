var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.fileUploaderImages = {
        multiple: true,
        uploadMode: "useButtons",
        uploadUrl: "https://js.devexpress.com/Content/Services/upload.aspx",
        allowedFileExtensions: [".jpg", ".jpeg", ".gif", ".png"]
    };

    $scope.fileUploaderMaxSize = {
        multiple: true,
        uploadMode: "useButtons",
        uploadUrl: "https://js.devexpress.com/Content/Services/upload.aspx",
        maxFileSize: 4000000
    };
});
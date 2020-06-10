var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var capitalize = function(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    $scope.showMessage = function(e) {
        var mode = e.component.option("stylingMode");
        DevExpress.ui.notify("The " + capitalize(mode) + " button was clicked");
    }
});

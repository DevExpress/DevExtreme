var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.date = new Date(2020, 4, 3);

    $scope.validateClick = function(e) {
        var result = e.validationGroup.validate();
        if (result.isValid) {
            DevExpress.ui.notify('The task was saved successfully.', 'success');
        } else {
            DevExpress.ui.notify('The task was not saved. Please check if all fields are valid.', 'error');
        }
    }

    $scope.stylingMode = 'filled';

    setTimeout(function() {
        DevExpress.validationEngine.validateGroup($scope);
    });
});

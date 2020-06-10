var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var options = {
        startScaleValue: 0,
        endScaleValue: 35,
        tooltip: {
            customizeTooltip: function (arg) {
                return {
                    text: 'Current t&#176: ' + arg.value + '&#176C<br>' + 'Average t&#176: ' + arg.target + '&#176C'
                };
            }
        }
    };
    
    $scope.june1 = $.extend({ value: 23, target: 20, color: '#ebdd8f' }, options);
    $scope.july1 = $.extend({ value: 27, target: 24, color: '#e8c267' }, options);
    $scope.august1 = $.extend({ value: 20, target: 26, color: '#e55253' }, options);
    
    $scope.june2 = $.extend({ value: 24, target: 22, color: '#ebdd8f' }, options);
    $scope.july2 = $.extend({ value: 28, target: 24, color: '#e8c267' }, options);
    $scope.august2 = $.extend({ value: 30, target: 24, color: '#e55253' }, options);
    
    $scope.june3 = $.extend({ value: 35, target: 24, color: '#ebdd8f' }, options);
    $scope.july3 = $.extend({ value: 24, target: 26, color: '#e8c267' }, options);
    $scope.august3 = $.extend({ value: 28, target: 22, color: '#e55253' }, options);
    
    $scope.june4 = $.extend({ value: 29, target: 25, color: '#ebdd8f' }, options);
    $scope.july4 = $.extend({ value: 24, target: 27, color: '#e8c267' }, options);
    $scope.august4 = $.extend({ value: 21, target: 21, color: '#e55253' }, options);
});
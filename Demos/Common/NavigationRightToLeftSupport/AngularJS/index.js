var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {

    var languages = [
        "Arabic: Right-to-Left direction",
        "English: Left-to-Right direction"
    ];
    
    $scope.languages = languages;
    $scope.continents = continents;
    $scope.europeCountries = europeCountries;
    $scope.selectBoxValue = languages[1];
    $scope.itemTitleTemplate = "englishTitle";
    $scope.itemTemplate = "english";
    $scope.rtlEnabled = false;
    $scope.displayExpr = "text";
    
    
    $scope.$watch("selectBoxValue", function(newValue){
            var isRTL = newValue === languages[0];
    
            $scope.itemTitleTemplate = isRTL ? "arabicTitle" : "englishTitle";
            $scope.itemTemplate = isRTL ? "arabic" : "english";
            $scope.rtlEnabled = isRTL;
            $scope.displayExpr = isRTL ? "textAr" : "text";
        });
});
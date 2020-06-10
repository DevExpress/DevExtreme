var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.palette = paletteCollection[0];
    $scope.paletteExtensionMode = "Blend";
    $scope.baseColors = [];

    $scope.chartOptions = {
        dataSource: dataSource,
        series: {},
        legend: {
            visible: false
        },
        bindingOptions: { 
            palette: "palette",
            paletteExtensionMode: "paletteExtensionMode"
        },
        onDrawn: function(e) { 
            var paletteName = e.component.option("palette"),
                palette = DevExpress.viz.getPalette(paletteName).simpleSet;
            
            $scope.baseColors = palette;
        }
    };

    $scope.paletteSelectBoxOptions = {
        items: paletteCollection,
        bindingOptions: {
            value: "palette"
        }    
    };

    $scope.extensionModeSelectBoxOptions = {
        items: paletteExtensionModes,
        bindingOptions: {
            value: "paletteExtensionMode"
        }    
    };
});
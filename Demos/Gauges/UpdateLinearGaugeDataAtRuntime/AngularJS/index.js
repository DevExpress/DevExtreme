var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.weatherData = cities[0].data;
    
    $scope.temperatureGauge = {
        bindingOptions: {
            value: "weatherData.temperature",
        },
        title: {
           text: "Temperature (°C)",
           font: {
              size: 16
           }
        },
        geometry: { orientation: "vertical" },
        scale: {
            startValue: -40, 
            endValue: 40,
            tickInterval: 40
        },
        rangeContainer: {
            backgroundColor: "none",
            ranges: [
                { startValue: -40, endValue: 0, color: "#679EC5" },
                { startValue: 0, endValue: 40 }
            ]
        }
    };
    
    $scope.humidityGauge = {
        bindingOptions: {
            value: "weatherData.humidity",
        },
        title: {
           text: "Humidity (%)",
           font: {
              size: 16
           }
        },
        geometry: { orientation: "vertical" },
        scale: {
            startValue: 0, 
            endValue: 100,
            tickInterval: 10,
        },
        rangeContainer: { backgroundColor: "#CACACA" },
        valueIndicator: { type: "rhombus", color: "#A4DDED" }
    };
    
    $scope.pressureGauge = {
        bindingOptions: {
            value: "weatherData.pressure",
        },
        title: {
           text: "Barometric Pressure (mb)",
           font: {
              size: 16
           }
        },
        geometry: { orientation: "vertical" },
        scale: {
            label: {
                format: {
                    type: "decimal"
                }
            },
            startValue: 900, endValue: 1100,
            customTicks: [900, 1000, 1020, 1100]
        },
        rangeContainer: {
            ranges: [
                { startValue: 900, endValue: 1000, color: "#679EC5" },
                { startValue: 1000, endValue: 1020, color: "#A6C567" },
                { startValue: 1020, endValue: 1100, color: "#E18E92" }
            ]
        },
        valueIndicator: { type: "circle", color: "#E3A857" }
    };
    
    $scope.selectBoxOptions = {
        dataSource: cities,
        displayExpr: "name",
        onValueChanged: function(e) {
            $scope.weatherData = e.value.data;
        },
        value: cities[0]
    };
});
var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.zoomFactorValue = "1.00";
    $scope.centerValue = "0.000, 46.036";
    
    $scope.vectorMapOptions = {
        layers: { 
            dataSource: DevExpress.viz.map.sources.world
        },
        bounds: [-180, 85, 180, -60],
        onZoomFactorChanged: function (e) {
            $scope.zoomFactorValue = e.zoomFactor.toFixed(2);
        },
        onCenterChanged: function (e) {
            $scope.centerValue = e.center[0].toFixed(3) + 
                ", " + e.center[1].toFixed(3);
        }
    };
    
    $scope.chooseContinent = {
        dataSource: viewportCoordinates,
        width: 210,
        displayExpr: "continent",
        valueExpr: "coordinates",
        value: viewportCoordinates[0].coordinates,
        onValueChanged: function (data) {
            $("#vector-map").dxVectorMap("instance").viewport(data.value);
        }
    };
    
    $scope.zoomFactor = {
        bindingOptions: {
            value: "zoomFactorValue"
        },
        readOnly: true,
        width: 210
    };
    
    $scope.center = {
        bindingOptions: {
            value: "centerValue"
        },
        readOnly: true,
        width: 210
    };
});
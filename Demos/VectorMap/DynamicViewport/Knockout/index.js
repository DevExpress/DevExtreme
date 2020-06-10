window.onload = function() {
    var zoomFactorValue = ko.observable("1.00"),
        centerValue = ko.observable("0.000, 46.036");
    
    var viewModel = {
        vectorMapOptions: {
            layers: { 
                dataSource: DevExpress.viz.map.sources.world
            },
            bounds: [-180, 85, 180, -60],
            onZoomFactorChanged: function (e) {
                zoomFactorValue(e.zoomFactor.toFixed(2));
            },
            onCenterChanged: function (e) {
                centerValue(e.center[0].toFixed(3) + 
                    ", " + e.center[1].toFixed(3));
            }
        },
        chooseContinent: {
            dataSource: viewportCoordinates,
            width: 210,
            displayExpr: "continent",
            valueExpr: "coordinates",
            value: viewportCoordinates[0].coordinates,
            onValueChanged: function (data) {
                $("#vector-map").dxVectorMap("instance").viewport(data.value);
            }
        },
        zoomFactor: {
            value: zoomFactorValue,
            readOnly: true,
            width: 210
        },
        center: {
            value: centerValue,
            readOnly: true,
            width: 210
        }
    };
    
    ko.applyBindings(viewModel, $("#vector-map-demo").get(0));
};
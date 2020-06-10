$(function(){
    var map = $("#vector-map").dxVectorMap({
        layers: { 
            dataSource: DevExpress.viz.map.sources.world
        },
        bounds: [-180, 85, 180, -60],
        onZoomFactorChanged: function (e) {
            zoomFactor.option("value", e.zoomFactor.toFixed(2));
        },
        onCenterChanged: function (e) {
            center.option("value", e.center[0].toFixed(3) + 
                ", " + e.center[1].toFixed(3));
        }
    }).dxVectorMap("instance");
    
    $("#choose-continent").dxSelectBox({
        dataSource: viewportCoordinates,
        width: 210,
        displayExpr: "continent",
        valueExpr: "coordinates",
        value: viewportCoordinates[0].coordinates,
        onValueChanged: function (data) {
            map.viewport(data.value);
        }
    });
    
    var zoomFactor = $("#zoom-factor").dxTextBox({
        width: 210,
        readOnly: true,
        value: "1.00"
    }).dxTextBox("instance");
    
    var center = $("#center").dxTextBox({
        width: 210,
        readOnly: true,    
        value: "0.000, 46.036"
    }).dxTextBox("instance");
});
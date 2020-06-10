$(function(){
    $("#map-container").dxVectorMap({
        title: {
            text: "Sea Currents"
        },
        maxZoomFactor: 3,
        layers: [{
            dataSource: DevExpress.viz.map.sources.world,
            hoverEnabled: false
        }, {
            name: "water",
            dataSource: streamsData,
            colorGroupingField: "tag",
            colorGroups: [0, 1, 2],
            palette: ["#3c20c8", "#d82020"],
            borderColor: "none",
            hoverEnabled: false
        }],
        legends: [{
            font: {
                size: 14
            },
            horizontalAlignment: "right",
            verticalAlignment: "top",
            customizeText: function () {
                if (this.color === "#3c20c8") {
                    return "Cold";
                } else {
                    return "Warm";
                }
            },
            source: { layer: "water", grouping: "color" }
        }],
        "export": {
            enabled: true
        },
        bounds: [-180, 85, 180, -75]
    });
});
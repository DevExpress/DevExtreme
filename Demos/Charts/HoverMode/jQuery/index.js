$(function(){
    $("#chart").dxChart({
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "state",
            type: "spline",
            hoverMode: "includePoints",
            point: {
                hoverMode: "allArgumentPoints"
            }
        },
        series: [
            { valueField: "year2004", name: "2004" },
            { valueField: "year2001", name: "2001" },
            { valueField: "year1998", name: "1998" }
        ],
        stickyHovering: false,
        title: {
            text: "Great Lakes Gross State Product"
        },
        "export": {
            enabled: true
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            hoverMode: "excludePoints"
        }
    });
});
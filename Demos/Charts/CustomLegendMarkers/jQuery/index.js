$(function() {
    var markerPath = {
        "Original Signal": "M 0 8 C 2 4 7 4 9.5 8 C 11 12 16 12 18 8 L 18 10 C 16 14 11 14 8.5 10 C 7 6 2 6 0 10 Z",
        "Noisy Signal": "M 18 8 L 12 12 L 7 3 L 0 7.4 L 0 10 L 6 6 L 11 15 L 18 10.6 Z"
    };
    $("#chart").dxChart({
        dataSource: dataSource,
        title: "Noisy and Original Signals",
        commonSeriesSettings: {
            argumentField: "argument",
            point: {
                visible: false
            }
        },
        series: [{
            valueField: "originalValue",
            name: "Original Signal"
        }, {
            valueField: "value",
            name: "Noisy Signal"
        }],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            markerTemplate: function(item, group) {
                var marker = document.createElementNS("http://www.w3.org/2000/svg", "path");
                var background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                var color = item.series.isVisible() ? item.marker.fill : "#888";

                background.setAttribute("fill", color);
                background.setAttribute("opacity", 0.3);
                background.setAttribute("width", 18);
                background.setAttribute("height", 18);
                background.setAttribute("x", 0);
                background.setAttribute("y", 0);
                marker.setAttribute("fill", color);
                marker.setAttribute("d", markerPath[item.series.name]);

                group.appendChild(marker);
                group.appendChild(background)
            }
        },
        onLegendClick(e) { 
            e.target.isVisible() ? e.target.hide() : e.target.show();
        }
    });
});
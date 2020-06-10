$(function() {
    $("#pie-chart").dxPieChart({
        palette: "bright",
        dataSource: states,
        title: "Top 10 Most Populated States in US",
        series: {
            argumentField: "name",
            valueField: "population"
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            contentTemplate: function(info, container) {
                $("<div class='state-tooltip'><img src='../../../../images/flags/" +
                    info.point.data.name.replace(/\s/, "").toLowerCase() + ".gif' /><h4>" +
                    info.argument + "</h4><div><span class='caption'>Capital</span>: " +
                    info.point.data.capital +
                    "</div><div><span class='caption'>Population</span>: " +
                    Globalize.formatNumber(info.value, { maximumFractionDigits: 0 }) +
                    " people</div>" + "<div><span class='caption'>Area</span>: " +
                    Globalize.formatNumber(info.point.data.area, { maximumFractionDigits: 0 }) +
                    " km<sup>2</sup> (" +
                    Globalize.formatNumber(0.3861 * info.point.data.area, { maximumFractionDigits: 0 }) +
                    " mi<sup>2</sup>)" + "</div>" + "</div>").appendTo(container);
            }
        }
    });
});
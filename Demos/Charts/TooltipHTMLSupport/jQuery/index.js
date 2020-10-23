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
                var contentItems =["<div class='state-tooltip'><img src='../../../../images/flags/" +
                    info.point.data.name.replace(/\s/, "") + ".svg' />",
                    "<h4 class='state'></h4>",
                    "<div class='capital'><span class='caption'>Capital</span>: </div>",
                    "<div class='population'><span class='caption'>Population</span>: </div>",
                    "<div><span class='caption'>Area</span>: ",
                    "<span class='area-km'></span> km<sup>2</sup> (",
                    "<span class='area-mi'></span> mi<sup>2</sup>)",
                    "</div></div>"];

                    var content = $(contentItems.join(""));
    
                    content.find(".state").text(info.argument);
                    content.find(".capital").append(document.createTextNode(info.point.data.capital));
                    content.find(".population").append(document.createTextNode(formatNumber(info.value) + " people"));
                    content.find(".area-km").text(formatNumber(info.point.data.area));
                    content.find(".area-mi").text(formatNumber(0.3861 * info.point.data.area));
    
                    content.appendTo(container);
            }
        }
    });
});
var formatNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format;
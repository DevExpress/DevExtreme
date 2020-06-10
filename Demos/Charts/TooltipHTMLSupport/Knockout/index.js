window.onload = function() {
    var viewModel = {
        pieChartOptions: {
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
                customizeTooltip: function (args) {
                    return {
                        html: "<div class='state-tooltip'><img src='../../../../images/flags/" + 
                        args.point.data.name.replace(/\s/, "").toLowerCase() + ".gif' /><h4>" +
                        args.argument + "</h4><div><span class='caption'>Capital</span>: " +
                        args.point.data.capital +
                        "</div><div><span class='caption'>Population</span>: " +
                        Globalize.formatNumber(args.value, { maximumFractionDigits: 0 }) +
                        " people</div>" + "<div><span class='caption'>Area</span>: " +
                        Globalize.formatNumber(args.point.data.area, { maximumFractionDigits: 0 }) +
                        " km<sup>2</sup> (" +
                        Globalize.formatNumber(0.3861 * args.point.data.area, { maximumFractionDigits: 0 }) +
                        " mi<sup>2</sup>)" + "</div>" + "</div>"
                    };
                }
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
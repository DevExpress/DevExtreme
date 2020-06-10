window.onload = function() {
    var viewModel = {
        chartOptions: {
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
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
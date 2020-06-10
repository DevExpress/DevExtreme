window.onload = function() {
    var viewModel = {
        chartOptions: {
            dataSource: dataSource,
            commonSeriesSettings: {
                argumentField: "year",
                type: "steparea",
                steparea: {
                    point: { visible: true }
                }
            },
            series: [{ valueField: "gold", name: "Gold Medals", color: "#ffd700" },
                     { valueField: "silver", name: "Silver Medals", color: "#c0c0c0" }],
            title: {
                text: "France Olympic Medals"
            },
            "export": {
                enabled: true
            },
            argumentAxis: {
                label: {
                    format: {
                        type: "decimal"
                    }
                }
            },
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
window.onload = function() {
    var viewModel = {
        chartOptions: {
            dataSource: populationData,
            legend: {
                visible: false
            },
            series: {
                type: "bar"
            },
            argumentAxis: {
                tickInterval: 10,
                label: {
                    format: {
                        type: "decimal"
                    }
                }
            },
            title: "World Population by Decade"
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
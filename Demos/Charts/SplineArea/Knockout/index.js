window.onload = function() {
    var currentType = ko.observable(types[0]);
    
    var viewModel = {
        chartOptions: {
            palette: "Harmony Light",
            title: "Corporations with Highest Market Value",
            dataSource: dataSource,
            commonSeriesSettings: {
                type: currentType,
                argumentField: "company"
            },
            argumentAxis: {
                valueMarginsEnabled: false
            },
            margin: {
                bottom: 20
            },
            series: [
                { valueField: "y2005", name: "2005" },
                { valueField: "y2004", name: "2004" }
            ],
            "export": {
                enabled: true
            },
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            }
        },
        typesOptions: {
            dataSource: types,
            value: currentType
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
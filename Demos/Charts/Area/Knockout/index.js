window.onload = function() {
    var currentType = ko.observable(types[0]);
    
    var viewModel = {
        chartOptions: {
            palette: "Harmony Light",
            dataSource: dataSource,
            commonSeriesSettings: {
                type: currentType,
                argumentField: "country"
            },
            series: [
                { valueField: "y1564", name: "15-64 years" },
                { valueField: "y014", name: "0-14 years" },
                { valueField: "y65", name: "65 years and older" }
            ],
            margin: {
                bottom: 20
            },
            title: "Population: Age Structure (2000)",
            argumentAxis: {
                valueMarginsEnabled: false
            },
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
            value: currentType,
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
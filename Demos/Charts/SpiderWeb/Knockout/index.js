window.onload = function() {
    var viewModel = {
        polarChartOptions: {
            dataSource: dataSource,
            useSpiderWeb: true,
            series: [{valueField: "apples", name: "Apples" },
                     { valueField: "grapes", name: "Grapes" },
                     { valueField: "lemons", name: "Lemons" },
                     { valueField: "oranges", name: "Oranges" }],
            commonSeriesSettings: {        
                type: "line"
            },
            "export": {
                enabled: true
            },
            title: "Fruit Production in 2010 (Millions of Tons)",
            tooltip: {
                enabled: true
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
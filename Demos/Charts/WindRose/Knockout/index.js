window.onload = function() {
    var dataSourceValue = ko.observable(dataSource[0].values);
    
    var viewModel = {
        polarChartOptions: {
            palette: "soft",
            dataSource: dataSourceValue,
            title: "Wind Rose, Philadelphia PA",
            commonSeriesSettings: {
                type: "stackedbar"
            },
            margin: {
                bottom: 50,
                left: 100
            },
            onLegendClick: function(e){
                var series = e.target;
                if (series.isVisible()) {
                    series.hide();
                } else {
                    series.show();
                }
            },
            argumentAxis: {
                discreteAxisDivisionMode: "crossLabels",
                firstPointOnStartAngle: true
            }, 
            valueAxis: {
                valueMarginsEnabled: false
            },
            "export": {
               enabled: true
            },
            series: [{ valueField: "val1", name: "1.3-4 m/s" },
                    { valueField: "val2", name: "4-8 m/s" },
                    { valueField: "val3", name: "8-13 m/s" },
                    { valueField: "val4", name: "13-19 m/s" },
                    { valueField: "val5", name: "19-25 m/s" },
                    { valueField: "val6", name: "25-32 m/s" },
                    { valueField: "val7", name: "32-39 m/s" },
                    { valueField: "val8", name: "39-47 m/s" }
            ]
        },
        selectBoxOptions: {
            width: 300,
            dataSource: dataSource,
            displayExpr: "period",
            valueExpr: "values",
            value: dataSourceValue,
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
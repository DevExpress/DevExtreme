window.onload = function() {
    var currentType = ko.observable(types[0]);
    
    var viewModel = {
        chartOptions: {
            palette: "bright",
            dataSource: dataSource,
            title: "Olympic Medals in 2008",
            margin: {
                bottom: 20
            },
            legend: {
                visible: false
            },
            animation: {
                enabled: false
            },
            resolveLabelOverlapping: currentType,
            "export": {
                enabled: true
            },
            series: [{
                argumentField: "country",
                valueField: "medals",
                label: {
                    visible: true,
                    customizeText: function(arg) {
                        return arg.argumentText + " (" + arg.percentText + ")";
                    }
                }
            }]
        },
        typesOptions: {
            dataSource: types,
            value: currentType,
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
window.onload = function() {
    var lineStyleValue = ko.observable(lineStyles[0]),
        breaksCountValue = ko.observable(breaksCount[2]),
        autoBreaksEnabledValue = ko.observable(true),
        viewModel = {
            chartOptions: {
                dataSource: dataSource,
                series: {
                    type: "bar",
                    valueField: "mass",
                    argumentField: "name"
                },
                valueAxis: {
                    visible: true,
                    autoBreaksEnabled: autoBreaksEnabledValue,
                    maxAutoBreakCount: breaksCountValue,
                    breakStyle: {
                        line: lineStyleValue
                    }
                },
                title: "Relative Masses of the Heaviest\n Solar System Objects",
                legend: {
                    visible: false
                },
                tooltip: {
                    enabled: true
                }
            },

            breaksCheckBoxOptions: {
                text: "Enable Breaks",
                value: autoBreaksEnabledValue
            },

            maxCountSelectBoxOptions: {
                items: breaksCount,
                value: breaksCountValue,
                width: 60
            },

            lineStyleSelectBoxOptions: {
                items: lineStyles,
                value: lineStyleValue,
                width: 120
            }
        };

    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
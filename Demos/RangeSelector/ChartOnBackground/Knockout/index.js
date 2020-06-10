window.onload = function() {
    var viewModel = {
        rangeSelectorOptions: {
            margin: {
                top: 50
            },
            scale: {
                minorTickInterval: "day",
                tickInterval: {
                    days: 7
                }
            },
            dataSource: [
                { t: new Date(2011, 11, 22), costs: 19, income: 18 },
                { t: new Date(2011, 11, 29), costs: 27, income: 12 },
                { t: new Date(2012, 0, 5), costs: 30, income: 5 },
                { t: new Date(2012, 0, 12), costs: 26, income: 6 },
                { t: new Date(2012, 0, 19), costs: 18, income: 10 },
                { t: new Date(2012, 0, 26), costs: 15, income: 15 },
                { t: new Date(2012, 1, 2), costs: 14, income: 21 },
                { t: new Date(2012, 1, 9), costs: 14, income: 25 }
            ],
            chart: {
                series: [
                    { argumentField: "t", valueField: "costs" },
                    { argumentField: "t", valueField: "income" }
                ],
                valueAxis: {
                    min: 0
                }
            },
            value: [new Date(2011, 11, 25), new Date(2012, 0, 1)],
            title: "Select a Range in the Costs and Revenues History"
        }
    };
    
    ko.applyBindings(viewModel, $("#range-selector-demo").get(0));
};
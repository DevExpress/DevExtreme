window.onload = function() {
    var viewModel = {
        rangeSelectorOptions: {
            dataSource: dataSource,
            margin: {
                top: 50
            },
            chart: {
                commonSeriesSettings: {
                    type: "steparea",
                    argumentField: "date"
                },
                series: [
                  { valueField: "dayT", color: "yellow" },
                  { valueField: "nightT" }
                ]
            },
            scale: {
                minorTickInterval: "day",
                tickInterval: "day",
                valueType: "datetime"
            },
            sliderMarker: {
                format: "day"
            },
            value: ["2013/03/01", "2013/03/07"],
            title: "Select a Month Period"
        }
    };
    
    ko.applyBindings(viewModel, $("#range-selector-demo").get(0));
};
window.onload = function() {
    var viewModel = {
        chartOptions: {
            seriesSelectionMode: "multiple",
            dataSource: dataSource,
            commonSeriesSettings: {
                argumentField: "year",
                type: "stackedarea"
            },
            commonAxisSettings: {
                valueMarginsEnabled: false
            },
            argumentAxis: {
                type: "discrete"
            },
            valueAxis: {
                label: {
                    format: {
                        type: "percent",
                        precision: 2
                    }
                }
            },
            series: [
                { valueField: "IE7", name: "Internet Explorer 7" },
                { valueField: "IE8", name: "Internet Explorer 8" },
                { valueField: "IE9", name: "Internet Explorer 9" },
                { valueField: "IE10", name: "Internet Explorer 10" }
            ],
            title: {
                text: "Internet Explorer Statistics"
            },
            "export": {
                enabled: true
            },
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            },
            onSeriesClick: function(e) {
                var series = e.target;
                if(series.isSelected()) {
                    series.clearSelection();
                } else { 
                    series.select();
                }
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
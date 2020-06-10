window.onload = function() {
    var viewModel = {
        chartOptions: {
            palette: "violet",
            dataSource: dataSource,
            commonSeriesSettings: {
                type: "rangeArea",
                argumentField: "date"
            },
            series: { 
                rangeValue1Field: "val2010", 
                rangeValue2Field: "val2011", 
                name: "2010 - 2011" 
            },
            title: "Annual Inflation Rate in 2010 and 2011",
            argumentAxis:{
                valueMarginsEnabled: false,
                label: {
                    format: "month"
                }
            },
            valueAxis: {
                visualRange:{
                    startValue: 0.5,
                    endValue: 4
                },
                tickInterval: 0.5,
                valueMarginsEnabled: false,
                label: {
                    format: {
                        type: "fixedPoint",
                        precision: 2
                    },
                    customizeText: function(){
                        return this.valueText + " %";
                    }
                }
            },
            "export": {
                enabled: true
            },
            legend: {
                visible:false
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
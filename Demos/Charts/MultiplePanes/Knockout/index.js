window.onload = function() {
    var viewModel = {
        chartOptions: {
            dataSource: dataSource,
            commonSeriesSettings:{
                argumentField: "month"
            },
            panes: [{
                    name: "topPane"
                }, {
                    name: "bottomPane"
                }],
            defaultPane: "bottomPane",
            series: [{ 
                    pane: "topPane",
                    color: "#b0daff",
                    type: "rangeArea",
                    rangeValue1Field: "minT",
                    rangeValue2Field: "maxT",
                    name: "Monthly Temperature Ranges, °C"
                }, {
                    pane: "topPane", 
                    valueField: "avgT",
                    name: "Average Temperature, °C",
                    label: {
                        visible: true,
                        customizeText: function (){
                            return this.valueText + " °C";
                        }
                    }
                }, {
                    type: "bar",
                    valueField: "prec",
                    name: "prec, mm",
                    label: {
                        visible: true,
                        customizeText: function (){
                            return this.valueText  + " mm";
                        }
                    }
                }
            ],    
            valueAxis: [{
                pane: "bottomPane",
                grid: {
                    visible: true
                },
                title: {
                    text: "Precipitation, mm"
                }
            }, {
                pane: "topPane",
                grid: {
                    visible: true
                },
                title: {
                    text: "Temperature, °C"
                }
            }],
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            },
            "export": {
                enabled: true
            },
            title: {
                text: "Weather in Glendale, CA"
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
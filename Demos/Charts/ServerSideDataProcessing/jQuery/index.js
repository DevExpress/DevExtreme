$(function(){

    var chartDataSource = new DevExpress.data.DataSource({
        store: {
            type: "odata",
            url: "https://js.devexpress.com/Demos/WidgetsGallery/odata/WeatherItems"
        },
        postProcess: function(results) {
            return results[0].DayItems;
        },
        expand: "DayItems",
        filter: ["Id", "=", 1],
        paginate: false
    });

    var chartOptions = {
        dataSource: chartDataSource,
        title: "Temperature in Barcelona, 2012",
        size: {
            height: 420
        },
        series: {
            argumentField: "Number",
            valueField: "Temperature",
            type: "spline"
        },
        legend: {
            visible: false
        },
        commonPaneSettings: {
            border: {
                visible: true,
                width: 2,
                top: false,
                right: false
            }
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.valueText + "&#176C"
                };
            }
        },
        valueAxis: {
            valueType: "numeric",
            grid: {
                opacity: 0.2
            },
            label: {
                customizeText: function() {
                    return this.valueText + "&#176C";
                }
            }
        },
        argumentAxis: {
            type: "discrete",
            grid: {
                visible: true,
                opacity: 0.5
            }
        },
        loadingIndicator: {
            enabled: true
        }
    };

    $("#chart").dxChart(chartOptions);

    $("#selectbox").dxSelectBox({
        width: 150,
        items: months,
        value: 1,
        valueExpr: "id",
        displayExpr: "name",
        onValueChanged: function(data) {
            chartDataSource.filter(["Id", "=", data.value]);
            chartDataSource.load();
        }
    });
});
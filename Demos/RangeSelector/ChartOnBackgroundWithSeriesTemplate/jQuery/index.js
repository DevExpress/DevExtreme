$(function(){
    $("#range-selector").dxRangeSelector({
        dataSource: dataSource,
        margin: {
            top: 50
        },
        chart: {
            commonSeriesSettings: {
                argumentField: "year",
                valueField: "oil",
                type: "spline"
            },
            seriesTemplate: {
                nameField: "country",
                customizeSeries: function (valueFromNameField) {
                    return valueFromNameField === "USA" ? { color: "red" } : {};
                }
            }
        },
        scale: {
            label: {
                format: {
                    type: "decimal"
                }
            }
        },
        title: "Select a Year Period"
    });
});
$(function(){
    $("#chart").dxChart({
        palette: "violet",
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "country",
            valueField: "oil",
            type: "bar"
        },
        seriesTemplate: {
            nameField: "year",
            customizeSeries: function(valueFromNameField) {
                return valueFromNameField === 2009 ? { type: "line", label: { visible: true }, color: "#ff3f7a" } : {};
            }
        },
        title: { 
            text: "Oil Production",
            subtitle: {
                text: "(in millions tonnes)"
            }
        },
        "export": {
            enabled: true
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        }
    });
});
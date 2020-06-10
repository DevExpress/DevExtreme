$(function(){
    $("#pie").dxPieChart({
        type: "doughnut",
        palette: "Soft Pastel",
        title: "Top Internet Languages",
        dataSource: dataSource,
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "bottom"
        },
        "export": {
            enabled: true
        },
        series: [{
            smallValuesGrouping: {
                mode: "topN",
                topCount: 3
            },        
            argumentField: "language",
            valueField: "percent",
            label: {
                visible: true,
                format: "fixedPoint",
                customizeText: function (point) {
                    return point.argumentText + ": " + point.valueText + "%";
                },
                connector: {
                    visible: true,
                    width: 1
                }
            }
        }]
    });
});
$(function(){
    $("#chart").dxChart({
        palette: "soft",
        dataSource: dataSource,
        commonSeriesSettings: {
            ignoreEmptyPoints: true,
            argumentField: "state",
            type: "bar"
        },
        series: [
            { valueField: "oil", name: "Oil Production" },
            { valueField: "gas", name: "Gas Production" },
            { valueField: "coal", name: "Coal Production" }
        ],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: "Percent of Total Energy Production"
    });
});
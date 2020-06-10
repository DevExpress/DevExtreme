$(function(){
    $("#chart").dxChart({
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "country",
            type: "fullStackedBar"
        },
        series: [
            { valueField: "hydro", name: "Hydro-electric" },
            { valueField: "oil", name: "Oil" },
            { valueField: "gas", name: "Natural gas" },
            { valueField: "coal", name: "Coal" },
            { valueField: "nuclear", name: "Nuclear" }
        ],
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "center",
            itemTextPosition: "right"
        },
        title: {
            text: "Energy Consumption in 2004",
            subtitle: {
                text: "(Millions of Tons, Oil Equivalent)" 
            }
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.percentText + " - " + arg.valueText
                };
            }
        }
    });
});
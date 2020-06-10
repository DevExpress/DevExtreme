$(function(){
    $("#range-selector").dxRangeSelector({
        dataSource: dataSource,
        margin: {
            top: 50
        },
        chart: {
            commonSeriesSettings: {
                type: "spline",
                argumentField: "weight"
            },
            series: [
                { valueField: "appleCost", color: "#00ff00" },
                { valueField: "orangeCost", color: "#ffa500" }
            ]
        },
        scale: {
            valueType: "numeric"
        },
        value: ["1", "2"],
        title: "Select a Product Weight"
    });
    
});
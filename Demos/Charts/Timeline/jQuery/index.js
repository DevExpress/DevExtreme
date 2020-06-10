$(function() {
    $("#chart").dxChart({
        dataSource: dataSource,
        rotated: true,
        barGroupPadding: 0.2,
        argumentAxis: {
            categories: ["Royal Houses"],
            tick: {
                visible: false
            }
        },
        title: {
            text: "The British Monarchy",
            subtitle: "An Abbreviated Timeline"
        },
        commonSeriesSettings: {
            argumentField: "monarch",
            type: "rangeBar",
            rangeValue1Field: "start",
            rangeValue2Field: "end",
            ignoreEmptyPoints: true,
            barOverlapGroup: "monarchs"
        },
        seriesTemplate: {
            nameField: "house"
        },
        animation: {
            enabled: false
        },
        legend: {
            title: "Royal Houses",
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        }
    });
});

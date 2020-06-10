$(function () {
    var chart = $("#chart").dxChart({
        dataSource: population,
        series: [{
            argumentField: "country"
        }],
        argumentAxis: {
            label: {
                wordWrap: "none",
                overlappingBehavior: overlappingModes[0]
            }
        },
        legend: {
            visible: false
        },
        title: "Population by Countries"
    }).dxChart("instance");

    $("#overlapping-modes").dxSelectBox({
        dataSource: overlappingModes,
        value: overlappingModes[0],
        onValueChanged: function (e) {
            chart.option("argumentAxis.label.overlappingBehavior", e.value);
        }
    });
});

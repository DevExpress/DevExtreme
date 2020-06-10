$(function(){
    var chart = $("#chart").dxChart({
        dataSource: dataSource,
        series: {
            type: "bar",
            valueField: "mass",
            argumentField: "name"
        },
        valueAxis: {
            visible: true,
            autoBreaksEnabled: true,
            maxAutoBreakCount: breaksCount[2],
            breakStyle: {
                line: lineStyles[0]
            }
        },
        title: "Relative Masses of the Heaviest\n Solar System Objects",
        legend: {
            visible: false
        },
        tooltip: {
            enabled: true
        }
    }).dxChart("instance");

    $("#breaks").dxCheckBox({
        text: "Enable Breaks",
        value: true,
        onValueChanged: function(data) {
            chart.option("valueAxis.autoBreaksEnabled", data.value);
        }
    });

    $("#max-count").dxSelectBox({
        items: breaksCount,
        value: breaksCount[2],
        width: 60,
        onValueChanged: function(data) {
            chart.option("valueAxis.maxAutoBreakCount", data.value);   
        }
    });

    $("#line-style").dxSelectBox({
        items: lineStyles,
        value: lineStyles[0],
        width: 120,
        onValueChanged: function(data) {
            chart.option("valueAxis.breakStyle.line", data.value);   
        }
    });
});
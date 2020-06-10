$(function () {
    var chartInstance = $("#chart").dxChart({
        rotated: true,
        title: "Olympic Gold Medals in 2008",
        dataSource: goldMedals,
        series: {
            color: "#f3c40b",
            argumentField: "country",
            valueField: "medals",
            type: "bar",
            label: {
                visible: true
            }
        },
        legend: {
            visible: false
        }
    }).dxChart("instance");

    var pieChartInstance = $("#pieChart").dxPieChart({
        palette: 'Harmony Light',
        dataSource: allMedals,
        title: "Total Olympic Medals\n in 2008",
        series: [{
            argumentField: "country",
            valueField: "medals",
            label: {
                visible: true,
                connector: {
                    visible: true
                }
            }
        }]
    }).dxPieChart("instance");

    $("#export").dxButton({
        icon: "export",
        text: "Export",
        type: "default",
        width: 145,
        onClick: function () {
            DevExpress.viz.exportWidgets([[chartInstance, pieChartInstance]], {
                fileName: "chart",
                format: 'PNG'
            });
        }
    });
});
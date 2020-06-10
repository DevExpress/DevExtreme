window.onload = function() {
    var viewModel = {
        chartOptions: {
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
        },
        pieOptions: {
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
        },
        buttonOptions: {
            icon: "export",
            text: "Export",
            type: "default",
            width: 145,
            onClick: function () {
                var chartInstance = $("#chart").dxChart("instance"),
                    pieChartInstance = $("#pieChart").dxPieChart("instance");

                DevExpress.viz.exportWidgets([[chartInstance, pieChartInstance]], {
                    fileName: "chart",
                    format: 'PNG'
                });
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
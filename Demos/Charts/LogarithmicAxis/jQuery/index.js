$(function(){
    $("#chart").dxChart({
        dataSource: dataSource,
        commonPaneSettings: {
            border: {
                visible: true
            }
        },
        series: {
            type: "scatter",
            valueField: "mass",
            argumentField: "name",
            point: {
                size: 20
            }
        },
        customizePoint: function () {
            var color, hoverStyle;
            switch (this.data.type) {
                case "Star":
                    color = "red";
                    hoverStyle = { border: { color: "red" } };
                    break;
                case "Satellite":
                    color = "gray";
                    hoverStyle = { border: { color: "gray" } };
            }
            return { color: color, hoverStyle: hoverStyle };
        },
        "export": {
            enabled: true
        },
        argumentAxis: {
            grid: {
                visible: true
            },
            label: {
                rotationAngle: 20,
                overlappingBehavior: "rotate"
            }
        },
        valueAxis: {
            type: "logarithmic",
            title: "Mass Relative to the Earth"
        },
        title: "Relative Masses of the Heaviest Solar System Objects",
        legend: {
            visible: false
        },
        tooltip: {
            enabled: true
        }
    });
});
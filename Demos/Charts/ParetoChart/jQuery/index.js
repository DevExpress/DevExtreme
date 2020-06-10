$(function () {
    var data = complaintsData.sort(function (a, b) {
            return b.count - a.count;
        }),
        totalCount = data.reduce(function (prevValue, item) {
            return prevValue + item.count;
        }, 0),
        cumulativeCount = 0,
        dataSource = data.map(function (item, index) {
            cumulativeCount += item.count;
            return {
                complaint: item.complaint,
                count: item.count,
                cumulativePercentage: Math.round(cumulativeCount * 100 / totalCount)
            };
        });

    $("#chart").dxChart({
        palette: "Harmony Light",
        dataSource: dataSource,
        title: "Pizza Shop Complaints",
        argumentAxis: {
            label: {
                overlappingBehavior: "stagger"
            }
        },
        tooltip: {
            enabled: true,
            shared: true,
            customizeTooltip: function (info) {
                return {
                    html: "<div><div class='tooltip-header'>" +
                    info.argumentText + "</div>" +
                    "<div class='tooltip-body'><div class='series-name'>" +
                    info.points[0].seriesName +
                    ": </div><div class='value-text'>" +
                    info.points[0].valueText +
                    "</div><div class='series-name'>" +
                    info.points[1].seriesName +
                    ": </div><div class='value-text'>" +
                    info.points[1].valueText +
                    "% </div></div></div>"
                };
            }
        },
        valueAxis: [{
            name: "frequency",
            position: "left",
            tickInterval: 300
        }, {
            name: "percentage",
            position: "right",
            showZero: true,
            label: {
                customizeText: function (info) {
                    return info.valueText + "%";
                }
            },
            constantLines: [{
                value: 80,
                color: "#fc3535",
                dashStyle: "dash",
                width: 2,
                label: { visible: false }
            }],
            tickInterval: 20,
            valueMarginsEnabled: false
        }],
        commonSeriesSettings: {
            argumentField: "complaint"
        },
        series: [{
            type: "bar",
            valueField: "count",
            axis: "frequency",
            name: "Complaint frequency",
            color: "#fac29a"
        }, {
            type: "spline",
            valueField: "cumulativePercentage",
            axis: "percentage",
            name: "Cumulative percentage",
            color: "#6b71c3"
        }],
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "center"
        }
    });
});
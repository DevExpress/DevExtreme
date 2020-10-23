window.onload = function () {
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

    var viewModel = {
        chartOptions: {
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
                    var tmpContainer = document.createElement("div");

                    tmpContainer.innerHTML = ["<div><div class='tooltip-header'></div>",
                    "<div class='tooltip-body'><div class='series-name'>",
                    "<span class='top-series-name'></span>",
                    ": </div><div class='value-text'>",
                    "<span class='top-series-value'></span>",
                    "</div><div class='series-name'>",
                    "<span class='bottom-series-name'></span>",
                    ": </div><div class='value-text'>",
                    "<span class='bottom-series-value'></span>",
                    "% </div></div></div>"].join("");
    
                    tmpContainer.querySelector(".tooltip-header").textContent = info.argumentText;
                    tmpContainer.querySelector(".top-series-name").textContent = info.points[0].seriesName;
                    tmpContainer.querySelector(".top-series-value").textContent = info.points[0].valueText;
                    tmpContainer.querySelector(".bottom-series-name").textContent = info.points[1].seriesName;
                    tmpContainer.querySelector(".bottom-series-value").textContent = info.points[1].valueText;
    
                    return {
                        html: tmpContainer.innerHTML
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
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
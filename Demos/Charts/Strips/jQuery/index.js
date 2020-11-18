$(function () {
    var highAverage = 60.8,
        lowAverage = 53,
        highAverageColor = "#ff9b52",
        lowAverageColor = "#6199e6";

    $("#chart").dxChart({
        dataSource: dataSource,
        series: [{
            argumentField: "day",
            valueField: "temperature",
            type: "spline",
            color: "#a3aaaa"
        }],
        valueAxis: {
            label: {
                customizeText: customizeText
            },
            strips: [{
                label: {
                    text: "Above average",
                    font: {
                        color: highAverageColor
                    }
                },
                startValue: highAverage,
                color: "rgba(255,155,85,0.15)"
            },
            {
                label: {
                    text: "Below average",
                    font: {
                        color: lowAverageColor
                    }
                },
                endValue: lowAverage,
                color: "rgba(97,153,230,0.1)"
            }],
            stripStyle: {
                label: {
                    font: {
                        weight: 500,
                        size: 14
                    }
                }
            }
        },
        "export": {
            enabled: true
        },
        title: "Temperature in September",
        legend: {
            visible: false
        },
        customizePoint: function () {
            if (this.value > highAverage) {
                return { color: highAverageColor };
            } else if (this.value < lowAverage) {
                return { color: lowAverageColor };
            }
        },
        customizeLabel: function () {
            if (this.value > highAverage) {
                return getLabelsSettings(highAverageColor);
            } else if (this.value < lowAverage) {
                return getLabelsSettings(lowAverageColor);
            }
        }
    });

    function customizeText() {
        return this.valueText + "&#176F";
    }
    function getLabelsSettings(backgroundColor) {
        return {
            visible: true,
            backgroundColor: backgroundColor,
            customizeText: customizeText
        };
    }
});

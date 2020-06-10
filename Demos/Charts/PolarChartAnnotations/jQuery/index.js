$(function () {
    var maxDay = dataSource.reduce(function(prev, current) {
        return prev.day >= current.day ? prev : current;
    });
    var minNight = dataSource.reduce(function(prev, current) {
        return prev.night <= current.night ? prev : current;
    });

    $("#radarChart").dxPolarChart({
        dataSource: dataSource,
        commonSeriesSettings: {
            type: "bar",
            opacity: 0.75
        },
        series: [
            { valueField: "day", name: "Day", color: "#fdff5e" },
            { valueField: "night", name: "Night", color: "#0f3b59" }
        ],
        commonAnnotationSettings: {
            type: "text",
            opacity: 0.7,
            arrowLength: 0
        },
        annotations: [{
            text: "WINTER",
            angle: 45,
            radius: 180
        }, {
            text: "SPRING",
            angle: 135,
            radius: 180
        }, {
            text: "SUMMER",
            angle: 225,
            radius: 180
        }, {
            text: "FALL",
            angle: 315,
            radius: 180
        }, {
            argument: maxDay.arg,
            series: "Day",
            text: "Highest temperature: " + maxDay.day + " °C",
            opacity: 1,
            offsetX: 105,
            paddingTopBottom: 15,
            paddingLeftRight: 15
        }, {
            argument: minNight.arg,
            series: "Night",
            text: "Lowest temperature: " + minNight.night + " °C",
            opacity: 1,
            offsetX: 105,
            paddingTopBottom: 15,
            paddingLeftRight: 15    
        }],
        argumentAxis: {
            strips: [{
                startValue: "December",
                endValue: "February",
                color: "#0076d1"
            }, {
                startValue: "March",
                endValue: "May",
                color: "#3ca3b0"
            }, {
                startValue: "June",
                endValue: "August",
                color: "#3fbc1e"
            }, {
                startValue: "September",
                endValue: "November",
                color: "#f0bb00"
            }]
        },
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "bottom"
        },
        title: "Average temperature in London"
    });
});
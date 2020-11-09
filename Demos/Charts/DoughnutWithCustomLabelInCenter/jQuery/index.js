$(function () {
   
    var formatNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format;
    var commonSettings = {
        innerRadius: 0.65,
        resolveLabelOverlapping: "shift",
        sizeGroup: "piesGroup",
        legend: {
            visible: false
        },
        type: "doughnut",
        series: [{
            argumentField: "commodity",
            valueField: "total",
            label: {
                visible: true,
                connector: {
                    visible: true
                },
                format: "fixedPoint",
                backgroundColor: "none",
                customizeText: function(e) {
                    return e.argumentText + "\n" + e.valueText;
                }
            }
        }],
        centerTemplate: function(pieChart, container) { 
            var total = pieChart.getAllSeries()[0].getVisiblePoints().reduce(function(s, p) { return s + p.originalValue; }, 0),
                country = pieChart.getAllSeries()[0].getVisiblePoints()[0].data.country,
                content = $('<svg><circle cx="100" cy="100" fill="#eee" r="' + (pieChart.getInnerRadius() - 6) + '"></circle>' +
                    '<image x="70" y="58" width="60" height="40" href="' + "../../../../images/flags/" + country.replace(/\s/, "").toLowerCase() + ".svg" + '"/>' +
                    '<text text-anchor="middle" style="font-size: 18px" x="100" y="120" fill="#494949">' +
                    '<tspan x="100" >' + country + '</tspan>' +
                    '<tspan x="100" dy="20px" style="font-weight: 600">' +
                    formatNumber(total) +
                    '</tspan></text></svg>');
            
            container.appendChild(content.get(0));
        }
    };

    $("#countries")
        .dxPieChart($.extend({}, commonSettings, {
            dataSource: {
                store: data,
                filter: ["country", "=", "France"]
            }
        }));

    $("#waterLandRatio")
        .dxPieChart($.extend({}, commonSettings, {
            dataSource: {
                store: data,
                filter: ["country", "=", "Germany"]
            }
        }));
    
});
window.onload = function() {
    var oilOptions = {
        dataSource: oilCosts,
        argumentField: "month",
        valueField: "2010",
        type: "line",
        showMinMax: true,
        tooltip: {
            format: "currency"
        }
    },
    goldOptions = {
        dataSource: goldCosts,
        argumentField: "month",
        valueField: "2010",
        type: "spline",
        lineWidth: 3,
        lineColor: "#9ab57e",
        minColor: "#6babac",
        maxColor: "#ebdd8f",
        showMinMax: true,
        showFirstLast: false,
        tooltip: {
            format: "currency"
        }
    },
    silverOptions = {
        dataSource: silverCosts,
        argumentField: "month",
        valueField: "2010",
        lineColor: "#e8c267",
        firstLastColor: "#e55253",
        pointSize: 6,
        pointSymbol: "square",
        pointColor: "#ebdd8f",
        type: "stepline",
        tooltip: {
            format: "currency"
        }
    };
    
    var viewModel = {
        line2010: oilOptions,
        spline2010: goldOptions,
        stepline2010: silverOptions,
        line2011: $.extend({}, oilOptions, { valueField: "2011" }),
        spline2011: $.extend({}, goldOptions, { valueField: "2011" }),
        stepline2011: $.extend({}, silverOptions, { valueField: "2011" }),
        line2012: $.extend({}, oilOptions, { valueField: "2012" }),
        spline2012: $.extend({}, goldOptions, { valueField: "2012" }),
        stepline2012: $.extend({}, silverOptions, { valueField: "2012" })
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
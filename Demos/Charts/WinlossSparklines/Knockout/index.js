window.onload = function() {
    var alumOptions = {
            dataSource: aluminumCosts,
            argumentField: "month",
            valueField: "2010",
            type: "winloss",
            showMinMax: true,
            winlossThreshold: 2100,
            tooltip: {
                format: "currency"
            }
        },
        nickOptions = {
            dataSource: nickelCosts,
            argumentField: "month",
            valueField: "2010",
            type: "winloss",
            showMinMax: true,
            showFirstLast: false,
            winColor: "#6babac",
            lossColor: "#8076bb",
            winlossThreshold: 19000,
            tooltip: {
                format: "currency"
            }
        },
        copOptions = {
            dataSource: copperCosts,
            argumentField: "month",
            valueField: "2010",
            type: "winloss",
            winlossThreshold: 8000,
            winColor: "#7e4452",
            lossColor: "#ebdd8f",
            firstLastColor: "#e55253",
            tooltip: {
                format: "currency"
            }
        };
    
    var viewModel = {
        alum2010: alumOptions,
        nick2010: nickOptions,
        cop2010: copOptions,
        alum2011: $.extend({}, alumOptions, { valueField: "2011" }),
        nick2011: $.extend({}, nickOptions, { valueField: "2011" }),
        cop2011: $.extend({}, copOptions, { valueField: "2011" }),
        alum2012: $.extend({}, alumOptions, { valueField: "2012" }),
        nick2012: $.extend({}, nickOptions, { valueField: "2012" }),
        cop2012: $.extend({}, copOptions, { valueField: "2012" })
    };
    
    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};
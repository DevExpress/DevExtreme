$(function(){
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
    
    $(".alum2010").dxSparkline(alumOptions);
    $(".nick2010").dxSparkline(nickOptions);
    $(".cop2010").dxSparkline(copOptions);
    
    $(".alum2011").dxSparkline($.extend(alumOptions, { valueField: "2011" }));
    $(".nick2011").dxSparkline($.extend(nickOptions, { valueField: "2011" }));
    $(".cop2011").dxSparkline($.extend(copOptions, { valueField: "2011" }));
    
    $(".alum2012").dxSparkline($.extend(alumOptions, { valueField: "2012" }));
    $(".nick2012").dxSparkline($.extend(nickOptions, { valueField: "2012" }));
    $(".cop2012").dxSparkline($.extend(copOptions, { valueField: "2012" }));
});
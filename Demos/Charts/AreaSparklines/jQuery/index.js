$(function(){
    var copOptions = {
        dataSource: copperCosts,
        argumentField: "month",
        valueField: "2010",
        type: "area",
        showMinMax: true,
        tooltip: {
            format: "currency"
        }
    },
    nickOptions = {
        dataSource: nickelCosts,
        argumentField: "month",
        valueField: "2010",
        type: "splinearea",
        lineColor: "#8076bb",
        minColor: "#6babac",
        maxColor: "#8076bb",
        pointSize: 6,
        showMinMax: true,
        showFirstLast: false,
        tooltip: {
            format: "currency"
        }
    },
    palOptions = {
        dataSource: palladiumCosts,
        argumentField: "month",
        valueField: "2010",
        firstLastColor: "#e55253",
        lineColor: "#7e4452",
        lineWidth: 3,
        pointColor: "#e8c267",
        pointSymbol: "polygon",
        type: "steparea",
        tooltip: {
            format: "currency"
        }
    };
    
    $(".area2010").dxSparkline(copOptions);
    $(".splinearea2010").dxSparkline(nickOptions);
    $(".steparea2010").dxSparkline(palOptions);
    
    $(".area2011").dxSparkline($.extend(copOptions, { valueField: "2011" }));
    $(".splinearea2011").dxSparkline($.extend(nickOptions, { valueField: "2011" }));
    $(".steparea2011").dxSparkline($.extend(palOptions, { valueField: "2011" }));
    
    $(".area2012").dxSparkline($.extend(copOptions, { valueField: "2012" }));
    $(".splinearea2012").dxSparkline($.extend(nickOptions, { valueField: "2012" }));
    $(".steparea2012").dxSparkline($.extend(palOptions, { valueField: "2012" }));
});
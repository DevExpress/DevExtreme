$(function(){
    var chart = $("#chart").dxPieChart({
        type: "doughnut",
        palette: "Soft Pastel",
        dataSource: dataSource,
        title: "The Population of Continents and Regions",
        tooltip: {
            enabled: false,
            format: "millions",
            customizeTooltip: function (arg) {
                return {
                    text: arg.argumentText + "<br/>" + arg.valueText
                };
            }
        },
        size: {
            height:350
        },
        onPointClick: function(e) {
            var point = e.target;
            point.showTooltip();
            region.option("value", point.argument);
        },
        legend: {
            visible: false
        },  
        series: [{
            argumentField: "region"
        }]
    }).dxPieChart("instance");
    
    var region = $("#selectbox").dxSelectBox({
        width: 250,
        dataSource: dataSource,
        displayExpr: "region",
        valueExpr: "region",
        placeholder: "Choose region",
        onValueChanged: function(data) {
            chart.getAllSeries()[0].getPointsByArg(data.value)[0].showTooltip();
        }
    }).dxSelectBox("instance");
});
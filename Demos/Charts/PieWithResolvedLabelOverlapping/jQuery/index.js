$(function(){
    var pieChart = $("#pie").dxPieChart({
        palette: "bright",
        dataSource: dataSource,
        title: "Olympic Medals in 2008",
        margin: {
            bottom: 20
        },
        legend: {
            visible: false
        },
        animation: {
            enabled: false
        },
        resolveLabelOverlapping: types[0],
        "export": {
            enabled: true
        },
        series: [{
            argumentField: "country",
            valueField: "medals",
            label: {
                visible: true,
                customizeText: function(arg) {
                    return arg.argumentText + " (" + arg.percentText + ")";
                }
            }
        }]
    }).dxPieChart("instance");
    
    $("#types").dxSelectBox({
        dataSource: types,
        value: types[0],
        onValueChanged: function(e){
            pieChart.option("resolveLabelOverlapping", e.value);
        }
    });
});
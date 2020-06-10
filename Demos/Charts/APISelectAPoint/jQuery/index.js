$(function(){
    var chart = $("#chart").dxChart({
        dataSource: dataSource,
        rotated: true,
        commonSeriesSettings: {
            argumentField: "breed",
            type: "bar"
        },
        series: {
            valueField: "count", 
            name: "breeds",
            color: "#a3d6d2",
            selectionStyle: {
                color: "#ec2e7a",
                hatching: { direction: "none" }
            }
        },
        title: {
            text: "Most Popular US Cat Breeds"
        },
        legend: {
            visible: false,     
        },
        "export": {
            enabled: true
        },
        onPointClick: function(e) {
            var point = e.target;
            if(point.isSelected()) {
                point.clearSelection();
            } else { 
                point.select();
            }
        }
    }).dxChart("instance");
    
    chart.getSeriesByPos(0).getPointsByArg("Siamese")[0].select();
});
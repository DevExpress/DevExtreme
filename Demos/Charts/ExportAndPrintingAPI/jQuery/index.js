$(function(){
    var chartInstance = $("#chart").dxChart({
        dataSource: dataSource,
        series: {
            argumentField: "name",
            valueField: "height",
            type: "bar",
            color: "#E55253"
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function(arg) {
                return {
                    text: "<span class='title'>" + arg.argumentText + "</span><br />&nbsp;<br />" + 
                        "System: " + arg.point.data.system + "<br />" + "Height: " + 
                        arg.valueText + " m"
                };
            }
        },
        title: "The Highest Mountains",
        legend: {
            visible: false
        },
        argumentAxis: {
            visible: true
        },
        valueAxis: {
            visualRange: {
                startValue: 8000
            },
            label: {
                customizeText: function() {
                    return this.value + " m";
                }
            }
        }
    }).dxChart("instance");
    
    $("#print").dxButton({
        icon: "print",
        text: "Print",
        onClick: function() {
            chartInstance.print();
        }
    });
    
    $("#export").dxButton({
        icon: "export",
        text: "Export",
        onClick: function() {
            chartInstance.exportTo("Example", "png");
        }
    });
});
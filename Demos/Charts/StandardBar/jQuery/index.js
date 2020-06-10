$(function(){
    $("#chart").dxChart({
        dataSource: dataSource, 
        series: {
            argumentField: "day",
            valueField: "oranges",
            name: "My oranges",
            type: "bar",
            color: '#ffaa66'
        }
    });
});
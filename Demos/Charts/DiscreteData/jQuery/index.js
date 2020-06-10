$(function(){
    var radarOptions = {
        margin: {
            top: 50,
            bottom: 50,
            left: 100
        },
        dataSource: dataSource,
        series: [{valueField: "day", name: "Day", color: "#ba4d51" }, 
                 { valueField: "night", name: "Night", color: "#5f8b95" }],
        commonSeriesSettings: {     
            type: "scatter"
        }
    };
    
    var radar = $("#radarChart").dxPolarChart(radarOptions).dxPolarChart("instance");
    
    $("#radarTypes").dxSelectBox({
        width: 200,
        dataSource: types,
        value: types[0],
        onValueChanged: function(e){
            radar.option("commonSeriesSettings.type", e.value);        
        }
    });
});
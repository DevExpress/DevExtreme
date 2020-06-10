$(function(){
    $("#chart").dxChart({
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "state",
            type: "stackedBar"
        },
        series: [
            { valueField: "maleyoung", name: "Male: 0-14", stack: "male" },
            { valueField: "malemiddle", name: "Male: 15-64", stack: "male" },
            { valueField: "maleolder", name: "Male: 65 and older", stack: "male" },
            { valueField: "femaleyoung", name: "Female: 0-14", stack: "female" },
            { valueField: "femalemiddle", name: "Female: 15-64", stack: "female" },
            { valueField: "femaleolder", name: "Female: 65 and older", stack: "female" }
        ],
        legend: {
            horizontalAlignment: "right",
            position: "inside",
            border: { visible: true },
            columnCount: 2,
            customizeItems: function(items) { 
                var sortedItems = [];

                items.forEach(function (item) {
                    var startIndex = item.series.stack === "male" ? 0 : 3;
                    sortedItems.splice(startIndex, 0, item);
                });
                return sortedItems;
            }
        },
        valueAxis: {
            title: {
                text: "Populations, millions"
            }
        },
        title: "Population: Age Structure",
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true
        }
    });
});
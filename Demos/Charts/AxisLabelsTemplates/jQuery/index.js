$(function () {
    $("#chart").dxChart({
        dataSource: dataSource,
        title: "Ice Hockey World Championship Gold Medal Winners",
        commonSeriesSettings: {
            type:"bar",
            label: {
                visible: true
            },
            argumentField: "country"
        },
        series: [{
            name: "Gold",
            valueField: "gold",
            color: "#ffd700"
        },{
            name: "Silver",
            valueField: "silver",
            color: "#c0c0c0"
        },{
            name: "Bronze",
            valueField: "bronze",
            color: "#cd7f32"
        }],
        argumentAxis: {
            label: {
                template: function(data, g) {
                    var content = $('<svg overflow="visible">' +
                        '<image filter="url(#DevExpress_shadow_filter)" y="0" width="60" height="40" href="' +
                        getFilePath(data.valueText) +'"></image>' +
                        '<text class="template-text" x="30" y="59" text-anchor="middle">' + data.valueText + '</text></svg>');
                    
                    g.appendChild(content.get(0));
                }
            }
        }
    });

    function getFilePath(text) {
        return "../../../../images/flags/3x2/" + text.toLowerCase().replace(" ", "") + ".svg";
    }
});
$(function(){
    $("#chart").dxChart({
        dataSource: dataSource,
        commonSeriesSettings: {
            type: 'bubble'
        },
        title: 'Correlation between Total Population and\n Population with Age over 60',
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.point.tag + '<br/>Total Population: ' + arg.argumentText + 'M<br/>Population with Age over 60: ' + arg.valueText + 'M (' + arg.size + '%)'
                };
            }
        },
        argumentAxis: {
            label: {
                customizeText: function () {
                    return this.value + 'M';
                }
            },
            title: 'Total Population'
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return this.value + 'M';
                }
            },
            title: 'Population with Age over 60'
        },
        legend: {
            position: 'inside',
            horizontalAlignment: 'left',
            border: {
                visible: true
            }
        },
        palette: ["#00ced1", "#008000", "#ffd700", "#ff7f50"],
        onSeriesClick: function(e) {
            var series = e.target;
            if (series.isVisible()) {
                series.hide();
            } else {
                series.show();
            }
        },
        "export": {
            enabled: true
        },
        series: [{
            name: 'Europe',
            argumentField: 'total1',
            valueField: 'older1',
            sizeField: 'perc1',
            tagField:'tag1'
        }, {
            name: 'Africa',
            argumentField: 'total2',
            valueField: 'older2',
            sizeField: 'perc2',
            tagField: 'tag2'
        }, {
            name: 'Asia',
            argumentField: 'total3',
            valueField: 'older3',
            sizeField: 'perc3',
            tagField: 'tag3'
        }, {
            name: 'North America',
            argumentField: 'total4',
            valueField: 'older4',
            sizeField: 'perc4',
            tagField: 'tag4'
        }]
    });
});
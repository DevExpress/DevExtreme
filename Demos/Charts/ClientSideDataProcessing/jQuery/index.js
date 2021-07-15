$(function(){
    var source = new DevExpress.data.DataSource({
        load: function () {
            return $.getJSON('../../../../data/monthWeather.json');
        },
        loadMode: 'raw',
        filter: ['t', '>', '2'],
        paginate: false
    });
    
    var palette = ["#c3a2cc", "#b7b5e0", "#e48cba"],
        paletteIndex = 0;
    
    $('#chart').dxChart({
        dataSource: source,
        title: 'Temperature in Seattle: October 2017',
        size: {
            height: 420
        },
        series: {
            argumentField: 'day',
            valueField: 't',
            type: 'bar'
        },
        customizePoint: function () {
            var color = palette[paletteIndex];
            paletteIndex = paletteIndex === 2 ? 0 : paletteIndex + 1;
    
            return {
                color: color
            };
        },
        legend: {
            visible: false
        },
        "export": {
            enabled: true
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    return this.valueText + '&#176C';
                }
            }
        },
        loadingIndicator: {
            enabled: true
        }
    });
    
    $("#choose-temperature").dxSelectBox({
        dataSource: [2, 4, 6, 8, 9, 10, 11],
        width: 70,
        value: 2,
        onValueChanged: function (data) {
            source.filter(['t', '>', data.value]);
            source.load();
        }
    });
});
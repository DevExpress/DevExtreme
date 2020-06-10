$(function(){
    var options = {
        scale: {
            startValue: 0, endValue: 100,
            tickInterval: 50,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + ' %';
                }
            }
        }
    };
    
    $("#c1").dxLinearGauge($.extend(true, {}, options, {
        value: 75,
        valueIndicator: {
            type: 'rectangle',
            color: '#9B870C'
        }
    }));
    $("#c2").dxLinearGauge($.extend(true, {}, options, {
        value: 80,
        valueIndicator: {
            type: 'rhombus',
            color: '#779ECB'
        }
    }));
    $("#c3").dxLinearGauge($.extend(true, {}, options, {
        value: 65,
        valueIndicator: {
            type: 'circle',
            color: '#8FBC8F'
        }
    }));
    $("#c4").dxLinearGauge($.extend(true, {}, options, {
        value: 90,
        valueIndicator: {
            type: 'rangebar',
            color: '#483D8B'
        }
    }));
    $("#c5").dxLinearGauge($.extend(true, {}, options, {
        value: 70,
        valueIndicator: {
            type: 'textCloud',
            color: '#734F96'
        }
    }));
    
    $("#c6").dxLinearGauge($.extend(true, {}, options, {
        value: 85,
        valueIndicator: {
            type: 'triangleMarker',
            color: '#f05b41'
        }
    }));
});
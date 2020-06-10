$(function(){
    $("#range-slider-simple").dxRangeSlider({
        min: 0,
        max: 100,
        start: 20,
        end: 60
    });
    
    $("#range-slider-with-label").dxRangeSlider({
        min: 0,
        max: 100,
        start: 35,
        end: 65,
        label: {
            visible: true,
            format: function(value) {
                return value + "%";
            },
            position: "top"
        }
    });
    
    $("#range-slider-with-tooltip").dxRangeSlider({
        min: 0,
        max: 100,
        start: 15,
        end: 65,
        tooltip: {
            enabled: true,
            format: function (value) {
                return value + "%";
            },
            showMode: "always", 
            position: "bottom"
        }
    });
    
    $("#range-slider-with-hide-range").dxRangeSlider({
        min: 0,
        max: 100,
        start: 20,
        end: 80,
        showRange: false
    });
    
    
    $("#range-slider-with-step").dxRangeSlider({
        min: 0,
        max: 100,
        start: 20,
        end: 70,
        step: 10,
        tooltip: {
            enabled: true
        }
    });
    
    $("#range-slider-disabled").dxRangeSlider({
        min: 0,
        max: 100,
        start: 25,
        end: 75,
        disabled: true
    });
    
    var handlerRangeSlider = $("#handler-range-slider").dxRangeSlider({
        min: 0,
        max: 100,
        start: 10,
        end: 90,
        onValueChanged: function(data){
            startValue.option("value", data.start);
            endValue.option("value", data.end);
        }
    }).dxRangeSlider("instance");
    
    var startValue = $("#start-value").dxNumberBox({
        value: 10,
        min: 0,
        max: 100,
        showSpinButtons: true,
        onValueChanged: function(data) {
            handlerRangeSlider.option("start", data.value);
        }
    }).dxNumberBox("instance");
    
    var endValue = $("#end-value").dxNumberBox({
        value: 90,
        min: 0,
        max: 100,
        showSpinButtons: true,
        onValueChanged: function(data) {
            handlerRangeSlider.option("end", data.value);
        }
    }).dxNumberBox("instance");
});
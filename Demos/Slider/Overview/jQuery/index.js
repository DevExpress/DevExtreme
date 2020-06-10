$(function(){
    $("#slider-simple").dxSlider({
        min: 0,
        max: 100,
        value: 90,
    });
    
    $("#slider-with-label").dxSlider({
        min: 0,
        max: 100,
        value: 50,
        label: {
            visible: true,
            format: function(value) {
                return value + "%";
            },
            position: "top"
        }
    });
    
    $("#slider-with-tooltip").dxSlider({
        min: 0,
        max: 100,
        value: 35,
        rtlEnabled: false,
        tooltip: {
            enabled: true,
            format: function (value) {
                return value + "%";
            },
            showMode: "always", 
            position: "bottom"
        }
    });
    
    $("#slider-with-hide-range").dxSlider({
        min: 0,
        max: 100,
        value: 20,
        showRange: false
    });
    
    $("#slider-with-step").dxSlider({
        min: 0,
        max: 100,
        value: 10,
        step: 10,
        tooltip: {
            enabled: true
        }
    });
    
    $("#slider-disabled").dxSlider({
        min: 0,
        max: 100,
        value: 50,
        disabled: true
    });
    
    var handlerSlider = $("#handler-slider").dxSlider({
        min: 0,
        max: 100,
        value: 10,
        onValueChanged: function(data) {
            sliderValue.option("value", data.value);
        }
    }).dxSlider("instance");
    
    var sliderValue = $("#slider-value").dxNumberBox({
        value: 10,
        min: 0,
        max: 100,
        showSpinButtons: true,
        onValueChanged: function(data) {
            handlerSlider.option("value", data.value);
        }
    }).dxNumberBox("instance");
});
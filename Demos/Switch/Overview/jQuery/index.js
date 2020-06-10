$(function(){
    $("#switch-on").dxSwitch({
        value: true
    });
    
    $("#switch-off").dxSwitch({
        value: false
    });
    
    $("#handler-switch").dxSwitch({
        onValueChanged: function(data) {
            disabledSwitch.option("value", data.value);
        }
    });
    
    var disabledSwitch = $("#disabled").dxSwitch({
        value: false,
        disabled: true
    }).dxSwitch("instance");
});
$(function(){
    $("#checked").dxCheckBox({
        value: true
    });
    
    $("#unchecked").dxCheckBox({
        value: false
    });
    
    $("#indeterminate").dxCheckBox({
        value: undefined
    });
    
    $("#handler").dxCheckBox({
        value: undefined,
        onValueChanged: function(data) {
            disabledCheckbox.option("value", data.value);
        }
    });
    
    var disabledCheckbox = $("#disabled").dxCheckBox({
        value: undefined,
        disabled: true
    }).dxCheckBox("instance");
    
    $("#withText").dxCheckBox({
        value: true,
        width: 80,
        text: "Check"
    });
});
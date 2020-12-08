$(function(){
    $("#simple").dxNumberBox({
    });
    
    $("#buttons").dxNumberBox({
        value: 20.5,
        showSpinButtons: true,
        showClearButton: true,
    });
    
    $("#disabled").dxNumberBox({
        value: 20.5,
        showSpinButtons: true,
        showClearButton: true,
        disabled: true
    });
    
    $("#minAndMax").dxNumberBox({
        value: 15,
        min: 10,
        max: 20,
        showSpinButtons: true
    });
    
    var totalProductQuantity = 30;
    
    $("#sales").dxNumberBox({
        max: totalProductQuantity,
        min: 0,
        value: 16,
        showSpinButtons: true,
        onKeyDown: function(e) {
            var event = e.event,
                str = event.key || String.fromCharCode(event.which);
            if(/^[.,e]$/.test(str)) {
                event.preventDefault();
            }
        },
        onValueChanged: function(data) {
            productInventory.option("value", totalProductQuantity - data.value);
        }
    });
    
    var productInventory = $("#stock").dxNumberBox({
        value: 14,
        min: 0,
        showSpinButtons: false,
        readOnly: true
    }).dxNumberBox("instance");
});
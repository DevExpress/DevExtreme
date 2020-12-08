$(function(){
    $("#simple").dxTextBox({
        value: "John Smith"
    });
    
    $("#placeholder").dxTextBox({
        placeholder: "Enter full name here..."
    });
    
    $("#clear-button").dxTextBox({
        value: "John Smith",
        showClearButton: true
    });
    
    $("#password").dxTextBox({
        mode: "password",
        placeholder: "Enter password",
        showClearButton: true,
        value: "f5lzKs0T",
    });
    
    $("#mask").dxTextBox({
        mask: "+1 (X00) 000-0000",
        maskRules: {"X": /[02-9]/}
    });
    
    $("#disabled").dxTextBox({
        value: "John Smith",
        disabled: true
    });
    
    $("#full-name").dxTextBox({
        value: "Smith",
        showClearButton: true,
        placeholder: "Enter full name",
        valueChangeEvent: "keyup",
        onValueChanged: function(data) {
            emailEditor.option("value", data.value.replace(/\s/g, "").toLowerCase() + "@corp.com");
        }
    });
    
    var emailEditor = $("#email").dxTextBox({
        value: "smith@corp.com",
        readOnly: true,
        hoverStateEnabled: false
    }).dxTextBox("instance");
});
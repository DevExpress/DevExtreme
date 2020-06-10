$(function(){
    var exampleTextArea = $("#example-textarea").dxTextArea({
        value: longText,
        height: 90
    }).dxTextArea("instance");
    
    $("#set-max-length").dxCheckBox({
        value: false,
        onValueChanged: function(data) {
            if (data.value) {
                exampleTextArea.option("value", (exampleTextArea.option("value")).substring(0, 100));
                exampleTextArea.option("maxLength", 100);
            } else {
                exampleTextArea.option("maxLength", null);
                exampleTextArea.option("value", longText);
            }
        },
        text: "Limit text length"
    });
    
    var valueChangeEvents = [{
        title: "On Blur",
        name: "change"
    }, {
        title: "On Key Up",
        name: "keyup"
    }];
    
    
    $("#change-event").dxSelectBox({
        items: valueChangeEvents,
        value: valueChangeEvents[0].name,
        valueExpr: "name",
        displayExpr: "title",
        onValueChanged: function(data) {
            editingTextArea.option("valueChangeEvent", data.value);
        }
    });
    
    var editingTextArea = $("#editing-textarea").dxTextArea({
        value: longText,
        height: 90,
        valueChangeEvent: "change",
        onValueChanged: function(data) {
            disabledTextArea.option("value", data.value);
        }
    }).dxTextArea("instance");
    
    var disabledTextArea = $("#disabled-textarea").dxTextArea({
        value: longText,
        height: 90,
        readOnly: true
    }).dxTextArea("instance");
});
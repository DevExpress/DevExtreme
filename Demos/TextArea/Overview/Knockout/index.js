window.onload = function() {
    var valueChangeEvents = [{
            title: "On Blur",
            name: "change"
        }, {
            title: "On Key Up",
            name: "keyup"
        }];
        
     var maxLength = ko.observable(null),
        value = ko.observable(longText),
        eventValue = ko.observable(valueChangeEvents[0].name),
        valueForEditableTextArea = ko.observable(longText);
    
    var viewModel = {
        textAreaWithMaxLength: {
            maxLength: maxLength,
            value: value,
            height: 90
        },
        checkBoxOptions: {
            value: false,
            onValueChanged: function(data) {
                if (data.value) {
                    value(longText.substring(0, 100));
                    maxLength(100);
                } else {
                    value(longText);
                    maxLength(null);
                }
            },
            text: "Limit text length"
        },
        selectBoxOptions: {
            items: valueChangeEvents,
            value: eventValue,
            valueExpr: "name",
            displayExpr: "title"
        },
        editableTextArea: {
            value: valueForEditableTextArea,
            height: 90,
            valueChangeEvent: eventValue
        },
        disabledTextArea: {
            value: valueForEditableTextArea,
            height: 90,
            readOnly: true
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("text-area-demo"));
};
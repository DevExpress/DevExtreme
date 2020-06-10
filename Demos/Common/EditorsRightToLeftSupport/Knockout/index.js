window.onload = function() {
    var languages = ["Arabic: Right-to-Left direction", "English: Left-to-Right direction"],
        displayExpr = ko.observable("nameEn"),
        rtlEnabled = ko.observable(false),
        textBoxValue = ko.observable("text"),
        textAreaValue = ko.observable("text"),
        checkBoxValue = ko.observable("text");
        
    var viewModel = {
        rtlEnabled: rtlEnabled,
        checkBoxOptions: {
            value: true,
            text: checkBoxValue,
            rtlEnabled: rtlEnabled
        },
        switchBoxOptions: {
            rtlEnabled: rtlEnabled
        },
        textBoxOptions: {
            showClearButton: true,
            value: textBoxValue,
            rtlEnabled: rtlEnabled
        },
        numberBoxOptions: {
            showSpinButtons: true,
            value: "123",
            rtlEnabled: rtlEnabled
        },
        selectBoxOptions: {
            items: europeanUnion,
            value: europeanUnion[0].id,
            displayExpr: displayExpr,
            valueExpr: "id",
            rtlEnabled: rtlEnabled
        },
        tagBoxOptions: {
            items: europeanUnion,
            value: [europeanUnion[0].id],
            placeholder: "...",
            displayExpr: displayExpr,
            valueExpr: "id",
            rtlEnabled: rtlEnabled
        },
        textAreaOptions: {
            value: textAreaValue,
            rtlEnabled: rtlEnabled
        },
        autocompleteOptions: {
            items: europeanUnion,
            valueExpr: displayExpr,
            rtlEnabled: rtlEnabled
        },
        selectLanguageOptions: {
            items: languages,
            value: languages[1],
            rtlEnabled: rtlEnabled,
            onValueChanged: function(data) {
                var rtl = data.value === languages[0];
                var text = rtl ? "نص" : "text";
                displayExpr(rtl ? "nameAr" : "nameEn");
                rtlEnabled(rtl);
                textBoxValue(text);
                textAreaValue(text);
                checkBoxValue(text);
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("form"));
};
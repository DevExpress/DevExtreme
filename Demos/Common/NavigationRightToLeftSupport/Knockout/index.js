window.onload = function() {
    
    var languages = [
        "Arabic: Right-to-Left direction",
        "English: Left-to-Right direction"
    ];
    
    var rtlEnabled = ko.observable(false);

    var accordionTemplate = ko.computed(function() {
        return rtlEnabled() ? "arabic" : "english";
    });

    var accordionTitleTemplate = ko.computed(function() {
        return rtlEnabled() ? "arabicTitle" : "englishTitle";
    });

    var displayExpr = ko.computed(function() {
        return rtlEnabled() ? "textAr" : "text";
    });
    
    var viewModel = {
        rtlEnabled: rtlEnabled,
        treeViewOptions: {
            dataSource: continents,
            width: 200,
            displayExpr: displayExpr,
            rtlEnabled: rtlEnabled
        },
        menuOptions: {
            dataSource: continents,
            rtlEnabled: rtlEnabled,
            displayExpr: displayExpr
        },
        accordionOptions: {
            dataSource: europeCountries,
            itemTitleTemplate: accordionTitleTemplate,
            itemTemplate: accordionTemplate,
            rtlEnabled: rtlEnabled,
        },
        selectBoxOptions: {
            items: languages,
            value: languages[1],
            onValueChanged: function(data) {
                rtlEnabled(data.value === languages[0]);
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("rtl"));
};
window.onload = function() {
    var showColon = ko.observable(true),
        formData = ko.observable(companies[0]),
        readOnly = ko.observable(false),
        labelLocation = ko.observable("top"),
        minColWidth = ko.observable(300),
        colCount = ko.observable(2),
        widthValue = ko.observable(undefined);
    
    var viewModel = {
        formOptions: {
            formData: formData,
            readOnly: readOnly,
            showColonAfterLabel: showColon,
            labelLocation: labelLocation,
            minColWidth: minColWidth,
            colCount: colCount,
            width: widthValue
        },
        selectCompanyOptions: {
            displayExpr: "Name",
            dataSource: companies,
            value: formData 
        },
        readOnlyOptions: {
            value: readOnly,
            text: "readOnly"
        },
        showColonOptions: {
            value: showColon,
            text: "showColonAfterLabel"
        },
        labelLocationOptions: {
            items: ["left", "top"],
            value: labelLocation
        },
        minColWidthOptions: {
            items: [150, 200, 300],
            value: minColWidth
        },
        colCountOptions: {
            items: ["auto", 1, 2, 3],
            value: colCount
        },
        widthOptions: {
            max: 550,
            value: widthValue
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("form-demo"));
};
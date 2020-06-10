window.onload = function() {
    var columnChooserModes = [{
        key: "dragAndDrop",
        name: "Drag and drop"
    }, {
        key: "select",
        name: "Select"
    }];

    var columnChooserMode = ko.observable("dragAndDrop"),
        allowSearch = ko.observable(true);

    var viewModel = {
        treeListOptions: {
            dataSource: employees,
            keyExpr: "ID",
            parentIdExpr: "Head_ID",
            columns: [{
                    dataField: "Title",
                    caption: "Position"
                }, {
                    dataField: "Full_Name",
                    allowHiding: false
                }, "City", "State", "Mobile_Phone", {
                    dataField: "Email",
                    visible: false
                }, {
                    dataField: "Hire_Date",
                    dataType: "date"
                }, {
                    dataField: "Skype",
                    visible: false
                }],
            columnAutoWidth: true,
            showRowLines: true,
            showBorders: true,
            columnChooser: {
                enabled: true,
                mode: columnChooserMode,
                allowSearch: allowSearch
            },
            expandedRowKeys: [1]
        },
        columnChooserOptions: {
            items: columnChooserModes,
            valueExpr: "key",
            displayExpr: "name",
            value: columnChooserMode
        },
        allowSearchOptions: {
            text: "Allow search",
            value: allowSearch
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("treelist"));
};
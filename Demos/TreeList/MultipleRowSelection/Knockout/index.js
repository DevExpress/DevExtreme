window.onload = function() {
    var recursiveSelectionEnabled = ko.observable(false),
        selectedRowKeys = ko.observableArray([]);

    recursiveSelectionEnabled.subscribe(function() {
        selectedRowKeys([]);
    });

    var viewModel = {
        treeListOptions: {
            dataSource: employees,
            keyExpr: "ID",
            parentIdExpr: "Head_ID",
            showRowLines: true,
            showBorders: true,
            columnAutoWidth: true,
            selectedRowKeys: selectedRowKeys,
            selection: {
                mode: "multiple",
                recursive: recursiveSelectionEnabled
            },
            columns: [{ 
                    dataField: "Full_Name"
                }, {
                    dataField: "Title",
                    caption: "Position"
                }, "City", "State",
                {
                    dataField: "Hire_Date",
                    dataType: "date",
                    width: 120
                }
            ],
            expandedRowKeys: [1, 2, 10]
        },
        recursiveOptions: {
            text: "Recursive Selection",
            value: recursiveSelectionEnabled
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("tree-list-demo"));
};
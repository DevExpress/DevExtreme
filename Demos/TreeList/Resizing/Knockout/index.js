window.onload = function() {
    var resizingModes = ["nextColumn", "widget"],
        columnResizingMode = ko.observable(resizingModes[0]);

    var viewModel = {
        treeListOptions: {
            dataSource: employees,
            keyExpr: "ID",
            parentIdExpr: "Head_ID",
            allowColumnResizing: true,
            columnResizingMode: columnResizingMode,
            columnMinWidth: 50,
            columnAutoWidth: true,
            columns: [{
                dataField: "Title",
                caption: "Position"
            }, "Full_Name", "City", "State", {
                dataField: "Hire_Date",
                dataType: "date"
            }],
            showRowLines: true,
            showBorders: true,
            expandedRowKeys: [1, 3, 6]
        },
        resizingOptions: {
            items: resizingModes,
            value: columnResizingMode,
            width: 250,
            onValueChanged: function(data) {
                columnResizingMode(data.value);    
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("treelist"));
};
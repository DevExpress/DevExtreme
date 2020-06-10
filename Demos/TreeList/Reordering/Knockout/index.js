window.onload = function() {
    var viewModel = {
        treeListOptions: {
            dataSource: employees,
            keyExpr: "ID",
            parentIdExpr: "Head_ID",
            columns: [{
                    dataField: "Full_Name",
                    allowReordering: false
                }, {
                    dataField: "Title",
                    caption: "Position"
                }, "City", "State", "Mobile_Phone", {
                    dataField: "Hire_Date",
                    dataType: "date"
                }
            ],
            showRowLines: true,
            showBorders: true,
            columnAutoWidth: true,
            expandedRowKeys: [1]
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("treelist"));
};
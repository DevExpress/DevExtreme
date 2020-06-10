window.onload = function() {
    var viewModel = {
        treeListOptions: {
            dataSource: employees,
            keyExpr: "ID",
            parentIdExpr: "Head_ID",
            columnAutoWidth: true,
            showRowLines: true,
            showBorders: true,
            selection: {
                mode: "single"
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
            expandedRowKeys: [1]
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("tree-list-demo"));
};
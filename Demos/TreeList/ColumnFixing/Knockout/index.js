window.onload = function() {
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
                    fixed: true
                }, "City", "State", "Mobile_Phone", "Email", {
                    dataField: "Hire_Date",
                    dataType: "date"
                }, {
                    dataField: "Birth_Date",
                    dataType: "date"
                }, "Skype"],
            columnAutoWidth: true,
            showRowLines: true,
            showBorders: true,
            columnFixing: {
                enabled: true
            },
            expandedRowKeys: [1, 2, 10]
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("treelist"));
};
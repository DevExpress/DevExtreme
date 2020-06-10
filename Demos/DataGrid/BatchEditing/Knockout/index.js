window.onload = function() {
    var viewModel = {
        dataGridOptions: {
            dataSource: employees,
            keyExpr: "ID",
            showBorders: true,
            paging: {
                enabled: false
            },
            editing: {
                mode: "batch",
                allowUpdating: true
            },
            columns: [
                {
                    dataField: "Prefix",
                    caption: "Title",
                    width: 70
                },
                "FirstName",
                "LastName", {
                    dataField: "Position",
                    width: 170
                }, {
                    dataField: "StateID",
                    caption: "State",
                    width: 125,
                    lookup: {
                        dataSource: states,
                        displayExpr: "Name",
                        valueExpr: "ID"
                    }
                }, {
                    dataField: "BirthDate",
                    dataType: "date",
                    showEditorAlways: true
                }
            ]
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("data-grid-demo"));
};
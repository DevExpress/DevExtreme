window.onload = function() {
    var viewModel = {
        gridOptions: {
            dataSource: employees,
            keyExpr: "ID",
            showBorders: true,
            selection: {
                mode: "single"
            },
            onSelectionChanged: function(e) {
                e.component.collapseAll(-1);
                e.component.expandRow(e.currentSelectedRowKeys[0]);
            },
            onContentReady: function(e) {
                if(!e.component.getSelectedRowKeys().length)
                    e.component.selectRowsByIndexes(0);
            },
            columns: [{
                dataField: "Prefix",
                caption: "Title",
                width: 70
            },
            "FirstName",
            "LastName", {
                dataField: "Position",
                width: 170
            }, {
                dataField: "State",
                width: 125
            }, {
                dataField: "BirthDate",
                dataType: "date"
            }],
            masterDetail: {
                enabled: false,
                template: "detail"
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("grid"));
};
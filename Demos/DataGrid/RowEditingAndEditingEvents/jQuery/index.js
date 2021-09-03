$(function(){
    function logEvent(eventName) {
        var logList = $("#events ul"),
            newItem = $("<li>", { text: eventName });

        logList.prepend(newItem);
    }
    
    $("#gridContainer").dxDataGrid({
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        paging: {
            enabled: false
        },
        editing: {
            mode: "row",
            allowUpdating: true,
            allowDeleting: true,
            allowAdding: true
        }, 
        columns: [
            {
                dataField: "Prefix",
                caption: "Title"
            }, "FirstName",
            "LastName", {
                dataField: "Position",
                width: 130
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
                width: 125
            },     
        ],
        onEditingStart: function() {
            logEvent("EditingStart");
        },
        onInitNewRow: function() {
            logEvent("InitNewRow");
        },
        onRowInserting: function() {
            logEvent("RowInserting");
        },
        onRowInserted: function() {
            logEvent("RowInserted");
        },
        onRowUpdating: function() {
            logEvent("RowUpdating");
        },
        onRowUpdated: function() {
            logEvent("RowUpdated");
        },
        onRowRemoving: function() {
            logEvent("RowRemoving");
        },
        onRowRemoved: function() {
            logEvent("RowRemoved");
        },
        onSaving: function() {
            logEvent("Saving");
        },
        onSaved: function() {
            logEvent("Saved");
        },
        onEditCanceling: function() {
            logEvent("EditCanceling");
        },
        onEditCanceled: function() {
            logEvent("EditCanceled");
        }
    });
    
    
    $("#clear").dxButton({
        text: "Clear",
        onClick: function() {
            $("#events ul").empty();
        }
    });
});
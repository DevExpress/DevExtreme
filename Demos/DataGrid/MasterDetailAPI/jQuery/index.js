$(function(){
    $("#gridContainer").dxDataGrid({
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
            template: function(container, options) { 
                var currentEmployeeData = options.data;
                container.append($('<div class="employeeInfo"><img class="employeePhoto" src="' + currentEmployeeData.Picture + '" /><p class="employeeNotes">' + currentEmployeeData.Notes + '</p></div>'));
            }
        }
    });
    
    
});
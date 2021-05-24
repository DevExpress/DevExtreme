$(function(){
    var employeesStore = new DevExpress.data.ArrayStore({
        key: "ID",
        data: employees
    });
    
    var deleteButton = $("#gridDeleteSelected").dxButton({
        text: "Delete Selected Records",
        height: 34,
        disabled: true,
        onClick: function () {
            $.each(dataGrid.getSelectedRowKeys(), function() {
                employeesStore.remove(this);
            });
            dataGrid.refresh();
        }
    }).dxButton("instance");
    
    var dataGrid = $("#gridContainer").dxDataGrid({
        dataSource: employeesStore,
        showBorders: true,
        paging: {
            enabled: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true
        },
        selection: {
            mode: "multiple"
        },
        onSelectionChanged: function(data) {
            deleteButton.option("disabled", !data.selectedRowsData.length);
        }, 
        columns: [
            {
                dataField: "Prefix",
                caption: "Title",
                width: 55
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
                dataType: "date"
            }
        ]
    }).dxDataGrid("instance");
    
    
});
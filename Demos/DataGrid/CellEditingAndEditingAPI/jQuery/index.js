$(function(){
    var employeesStore = new DevExpress.data.ArrayStore({
        key: "ID",
        data: employees
    });
    
    var deleteButton;
    var deleteButtonOptions = {
        text: "Delete Selected Records",
        icon: "trash",
        disabled: true,
        onClick: function() {
            dataGrid.getSelectedRowKeys().forEach((key) => {
                employeesStore.remove(key);
            });
            dataGrid.refresh();
        },
        onInitialized: function(e) {
            deleteButton = e.component;
        }
    };
    
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
            },
        ],
        onToolbarPreparing: function(e) {
            var dataGrid = e.component;
            
            e.toolbarOptions.items[0].showText = 'always';

            e.toolbarOptions.items.push({
                location: "after",
                widget: "dxButton",
                options: deleteButtonOptions
            });
        },
        onSelectionChanged: function(data) {
            deleteButton.option("disabled", !data.selectedRowsData.length);
        },
    }).dxDataGrid("instance");
    
    
});
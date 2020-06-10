$(function(){
    var dataGrid,
        changedBySelectBox;
    
    dataGrid = $("#grid-container").dxDataGrid({
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        selection: {
            mode: "multiple"
        },
        columns: [{
                dataField: "Prefix",
                caption: "Title",
                width: 70
            },
            "FirstName",
            "LastName", {
                dataField: "Position",
                width: 180
            }, {
                dataField: "BirthDate",
                dataType: "date",
                width: 125
            }, {
                dataField: "HireDate",
                dataType: "date",
                width: 125
            }
        ],
        onSelectionChanged: function(selectedItems) {
            var data = selectedItems.selectedRowsData;
            if(data.length > 0)
                $("#selected-items-container").text(
                $.map(data, function(value) {
                    return value.FirstName + " " + value.LastName;
                }).join(", "));
            else 
                $("#selected-items-container").text("Nobody has been selected");
            if(!changedBySelectBox)
                $("#select-prefix").dxSelectBox("instance").option("value", null);
    
            changedBySelectBox = false;
            clearButton.option("disabled", !data.length);
        }
    }).dxDataGrid("instance");
    
    $("#select-prefix").dxSelectBox({
        dataSource: ["All", "Dr.", "Mr.", "Mrs.", "Ms."],
        placeholder: "Select title",
        onValueChanged: function (data) {
            if(!data.value)
                return;
            changedBySelectBox = true;
            if (data.value == "All") {
                dataGrid.selectAll();
            } else {
                var employeesToSelect = $.map($.grep(dataGrid.option("dataSource"), function(item) {
                    return item.Prefix === data.value;
                }), function(item) {
                    return item.ID;
                });
                dataGrid.selectRows(employeesToSelect);
            }
        }
    });
    
    var clearButton = $("#gridClearSelection").dxButton({
        text: "Clear Selection",
        disabled: true,
        onClick: function () {
            dataGrid.clearSelection();
        }
    }).dxButton("instance");
});
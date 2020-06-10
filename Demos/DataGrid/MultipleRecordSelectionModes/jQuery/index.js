$(function(){
    var dataGrid = $("#grid-container").dxDataGrid({
        dataSource: sales,
        keyExpr: "orderId",
        showBorders: true,
        selection: {
            mode: "multiple"
        },
        paging: {
            pageSize: 10
        },
        filterRow: { 
            visible: true
        },
        columns: [{ 
                dataField: "orderId", 
                caption: "Order ID",
                width: 90
            },
            "city", { 
                dataField: "country", 
                width: 180
            },
            "region", {
                dataField: "date",
                dataType: "date"
            }, {
                dataField: "amount",
                format: "currency",
                width: 90
            }]
    }).dxDataGrid("instance");
    
    $("#select-all-mode").dxSelectBox({
        dataSource: ["allPages", "page"],
        value: "allPages",
        onValueChanged: function (data) {
            dataGrid.option("selection.selectAllMode", data.value);
        }
    });
    
    $("#show-checkboxes-mode").dxSelectBox({
        dataSource: ["none", "onClick", "onLongTap", "always"],
        value: "onClick",
        onValueChanged: function (data) {
            dataGrid.option("selection.showCheckBoxesMode", data.value);
            $("#select-all-mode").dxSelectBox("instance").option("disabled", data.value === "none");
        }
    });
});
$(function() {
    $("#filterBuilder").dxFilterBuilder({
        fields: fields,
        value: filter
    });

    $("#apply").dxButton({
        text: "Apply Filter",
        type: "default",
        onClick: function() {
            var filter = $("#filterBuilder").dxFilterBuilder("instance").option("value");
            $("#dataGrid").dxDataGrid("instance").option("filterValue", filter);
        },
    });

    $("#dataGrid").dxDataGrid({
        columns: fields,
        showBorders: true,
        dataSource: {
            store: {
                type: "odata",
                fieldTypes: {
                    "Product_Cost": "Decimal",
                    "Product_Sale_Price": "Decimal",
                    "Product_Retail_Price": "Decimal"
                },
                url: "https://js.devexpress.com/Demos/DevAV/odata/Products"
            },
            select: [
                "Product_ID",
                "Product_Name",
                "Product_Cost",
                "Product_Sale_Price",
                "Product_Retail_Price",
                "Product_Current_Inventory"
            ]
        },
        filterValue: filter,
        height: 300
    });
});
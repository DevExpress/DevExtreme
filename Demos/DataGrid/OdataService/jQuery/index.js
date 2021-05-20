$(function(){
    $("#gridContainer").dxDataGrid({
        showBorders: true,
        dataSource: {
            store: {
                type: "odata",
                url: "https://js.devexpress.com/Demos/DevAV/odata/Products",
                key: 'Product_ID'
            },
            select: [
                "Product_ID",
                "Product_Name",
                "Product_Cost",
                "Product_Sale_Price",
                "Product_Retail_Price",
                "Product_Current_Inventory"
            ],
            filter: ["Product_Current_Inventory", ">", 0]
        },
        columns: [
            "Product_ID", {
                dataField: "Product_Name",
                width: 250
            }, {
                caption: "Cost",
                dataField: "Product_Cost",
                dataType: "number",
                format: "currency"
            }, {
                dataField: "Product_Sale_Price",
                caption: "Sale Price",
                dataType: "number",
                format: "currency"
            }, {
                dataField: "Product_Retail_Price",
                caption: "Retail Price",
                dataType: "number",
                format: "currency"
            }, {
                dataField: "Product_Current_Inventory",
                caption: "Inventory"
            }
        ]
    });
});
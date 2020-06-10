$(function() {
    var products = new DevExpress.data.DataSource({
        store: productsData,
        key: "id",
        group: "Category"
    });
    
    $("#TagBox").dxTagBox({
        dataSource: products,
        valueExpr: "ID",
        value: [productsData[16].ID, productsData[18].ID],
        grouped: true,
        displayExpr: "Name"
    });
    
    $("#TagBoxSearch").dxTagBox({
        dataSource: products,
        valueExpr: "ID",
        value: [productsData[16].ID, productsData[18].ID],
        searchEnabled: true,
        grouped: true,
        displayExpr: "Name"
    });
    
    $("#TagBoxTemplate").dxTagBox({
        dataSource: products,
        valueExpr: "ID",
        value: [productsData[17].ID],
        grouped: true,
        groupTemplate: function(data) {
            return $("<div class='custom-icon'><span class='dx-icon-box icon'></span> " + data.key + "</div>");
        },
        displayExpr: "Name"
    });
});
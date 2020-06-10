window.onload = function() {
    var products = new DevExpress.data.DataSource({
        store: productsData,
        key: "id",
        group: "Category"
    });
    
    var viewModel = {
        TagBoxOptions: {
            dataSource: products,
            valueExpr: "ID",
            value: [productsData[16].ID, productsData[18].ID],
            grouped: true,
            displayExpr: "Name"
        },
        
        searchTagBoxOptions: {
            dataSource: products,
            valueExpr: "ID",
            value: [productsData[16].ID, productsData[18].ID],
            searchEnabled: true,
            grouped: true,
            displayExpr: "Name"
        },
        
        templateTagBoxOptions: {
            dataSource: products,
            valueExpr: "ID",
            value: [productsData[17].ID],
            grouped: true,
            groupTemplate: "group",
            displayExpr: "Name"
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("select-box-demo"));
};
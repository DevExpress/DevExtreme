$(function() {
    var diagram = $("#diagram").dxDiagram({
        nodes: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "ID",
                data: employees
            }),
            keyExpr: "ID",
            textExpr: "Full_Name",
            parentKeyExpr: "Head_ID",
            autoLayout: {
                type: "tree"
            }
        },
        onContentReady: function(e) {
            var diagram = e.component;
            // preselect some shape
            var items = diagram.getItems().filter(function(item) {
                return item.itemType === "shape" && (item.text === "Greta Sims");
            });
            if(items.length > 0) {
                diagram.setSelectedItems(items);
                diagram.scrollToItem(items[0]);
                diagram.focus();
            }
        },
        onSelectionChanged: function(e) {
            var items = e.items
                .filter(function(item) { return item.itemType === "shape"; })
                .map(function(item) { return item.text; });
            if(items.length > 0)
                $("#selected-items-container").text(items.join(", "));
            else 
                $("#selected-items-container").text("Nobody has been selected");
        },
        propertiesPanel: {
            visibility: "disabled"
        },
        toolbox: {
            visibility: 'disabled'
        },
    }).dxDiagram("instance");
});

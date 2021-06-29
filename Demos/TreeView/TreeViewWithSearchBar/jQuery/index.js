$(function(){
    var treeView = $("#treeview").dxTreeView({ 
        items: products,
        width: 500,
        searchEnabled: true
    }).dxTreeView("instance");

    $("#searchMode").dxSelectBox({
        items: ["contains", "startswith", "equals"],
        value: "contains",
        onValueChanged: function(data) {
            treeView.option("searchMode", data.value);
        }
    });
});
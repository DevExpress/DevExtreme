$(function(){
    $("#simple-treeview").dxTreeView({ 
        createChildren: function(parent) {
            var parentId = parent ? parent.itemData.id : "";

            return $.ajax({
                url: "https://js.devexpress.com/Demos/Mvc/api/TreeViewData",
                dataType: "json",
                data: { parentId: parentId }
            });
        },
        rootValue: "",
        dataStructure: "plain",
        height: 500
    });
});
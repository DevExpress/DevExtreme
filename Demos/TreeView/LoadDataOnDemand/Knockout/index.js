window.onload = function() {
    var viewModel = {
        treeViewOptions: {
            createChildren: function(parent) {
                var parentId = parent ? parent.itemData.id : "";
                return $.ajax({
                    url: "https://js.devexpress.com/Demos/Mvc/api/TreeViewData",
                    dataType: "json",
                    data: { parentId: parentId }
                });
            },
            dataStructure: "plain",
            rootValue: "",
            height: 500
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("treeview"));
};
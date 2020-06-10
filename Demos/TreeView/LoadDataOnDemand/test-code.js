(function (factory) {
    if (window.Promise && window.System) {
        Promise.all([
            System.import("devextreme/ui/tree_view")
        ]).then(function (args) {
            factory(args[0]);
        });
    } else {
        factory(DevExpress.ui.dxTreeView);
    }
})(function (dxTreeView) {
    if(!window.$) return;
    
    var treeView = dxTreeView.getInstance(document.getElementById("simple-treeview"));
    function changeCreateChildren(treeView) {
        treeView.option("createChildren", function (parentNode) {
          return [
            { text: "Video Players", hasItems: false },
            { text: "Televisions" },
            { text: "Monitors" },
            { text: "Projectors" }
          ];
        });
        treeView.option("dataSource", []);
    }
    
    changeCreateChildren(treeView);
    treeView.option("onOptionChanged", (e) => { 
      if(e.name === "items" && Array.isArray(e.value) && e.value.length != 4) {
        changeCreateChildren(treeView);
      }
    });
});

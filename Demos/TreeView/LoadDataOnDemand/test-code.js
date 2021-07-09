testUtils.importAnd(()=>'devextreme/ui/tree_view', ()=>DevExpress.ui.dxTreeView, function (dxTreeView) {    
    
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

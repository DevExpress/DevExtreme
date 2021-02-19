$(function(){
    var treeView, dataGrid;
    
    var syncTreeViewSelection = function(treeView, value){
        if (!value) {
            treeView.unselectAll();
            return;
        }
        
        value.forEach(function(key){
            treeView.selectItem(key);
        });
    };
    
    var makeAsyncDataSource = function(jsonFile){
        return new DevExpress.data.CustomStore({
            loadMode: "raw",
            key: "ID",
            load: function() {
                return $.getJSON("../../../../data/" + jsonFile);
            }
        });
    };

    $("#treeBox").dxDropDownBox({
        value: ["1_1"],
        valueExpr: "ID",
        displayExpr: "name",
        placeholder: "Select a value...",
        showClearButton: true,
        dataSource: makeAsyncDataSource("treeProducts.json"),
        contentTemplate: function(e){
            var value = e.component.option("value"),
                $treeView = $("<div>").dxTreeView({
                    dataSource: e.component.getDataSource(),
                    dataStructure: "plain",
                    keyExpr: "ID",
                    parentIdExpr: "categoryId",
                    selectionMode: "multiple",
                    displayExpr: "name",
                    selectByClick: true,
                    onContentReady: function(args){
                        syncTreeViewSelection(args.component, value);
                    },
                    selectNodesRecursive: false,
                    showCheckBoxesMode: "normal",
                    onItemSelectionChanged: function(args){
                        var selectedKeys = args.component.getSelectedNodeKeys();
                        e.component.option("value", selectedKeys);
                    }
                });
            
            treeView = $treeView.dxTreeView("instance");
            
            e.component.on("valueChanged", function(args){
                var value = args.value;
                syncTreeViewSelection(treeView, value);
            });
            
            return $treeView;
        }
    });
    
    $("#gridBox").dxDropDownBox({
        value: [3],
        valueExpr: "ID",
        placeholder: "Select a value...",
        displayExpr: "CompanyName",
        showClearButton: true,
        dataSource: makeAsyncDataSource("customers.json"),
        contentTemplate: function(e){
            var value = e.component.option("value"),
                $dataGrid = $("<div>").dxDataGrid({
                    dataSource: e.component.getDataSource(),
                    columns: ["CompanyName", "City", "Phone"],
                    hoverStateEnabled: true,
                    paging: { enabled: true, pageSize: 10 },
                    filterRow: { visible: true },
                    scrolling: { mode: "virtual" },
                    height: 345,
                    selection: { mode: "multiple" },
                    selectedRowKeys: value,
                    onSelectionChanged: function(selectedItems){
                        var keys = selectedItems.selectedRowKeys;
                        e.component.option("value", keys);
                    }
                });
            
            dataGrid = $dataGrid.dxDataGrid("instance");
            
            e.component.on("valueChanged", function(args){
                var value = args.value;
                dataGrid.selectRows(value, false);
            });
            
            return $dataGrid;
        }
    });
});

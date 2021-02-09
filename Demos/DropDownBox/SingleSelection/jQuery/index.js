$(function(){
    var treeView, dataGrid;
    
    var syncTreeViewSelection = function(treeView, value){
        if (!value) {
            treeView.unselectAll();
        } else {
            treeView.selectItem(value);
        }
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
        value: "1_1",
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
                    selectionMode: "single",
                    displayExpr: "name",
                    selectByClick: true,
                    onContentReady: function(args){
                        syncTreeViewSelection(args.component, value);
                    },
                    selectNodesRecursive: false,
                    onItemSelectionChanged: function(args){
                        var selectedKeys = args.component.getSelectedNodeKeys();
                        e.component.option("value", selectedKeys);
                    }
                });
            
            treeView = $treeView.dxTreeView("instance");
            
            e.component.on("valueChanged", function(args){
                syncTreeViewSelection(treeView, args.value);
                e.component.close();
            });
            
            return $treeView;
        }
    });
    
    $("#gridBox").dxDropDownBox({
        value: 3,
        valueExpr: "ID",
        deferRendering: false,
        placeholder: "Select a value...",
        displayExpr: function(item){
            return item && item.CompanyName + " <" + item.Phone + ">";
        },
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
                    scrolling: { mode: "infinite" },
                    selection: { mode: "single" },
                    selectedRowKeys: [value],
                    height: "100%",
                    onSelectionChanged: function(selectedItems){
                        var keys = selectedItems.selectedRowKeys,
                            hasSelection = keys.length;
                        
                        e.component.option("value", hasSelection ? keys[0] : null);
                    }
                });
            
            dataGrid = $dataGrid.dxDataGrid("instance");
            
            e.component.on("valueChanged", function(args){
                dataGrid.selectRows(args.value, false);
                e.component.close();
            });
            
            return $dataGrid;
        }
    });
});

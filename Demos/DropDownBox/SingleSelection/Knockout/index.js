window.onload = function() {
    var treeView;
    
    var syncTreeViewSelection = function(treeView, value){
        if (!treeView) return;
        
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

    var getSelectedItemsKeys = function(items) {
        var result = [];
        items.forEach(function(item) {
            if(item.selected) {
                result.push(item.key);
            }
            if(item.items.length) {
                result = result.concat(getSelectedItemsKeys(item.items));
            }
        });
        return result;
    };

    var treeDataSource = makeAsyncDataSource("treeProducts.json"),
        gridDataSource = makeAsyncDataSource("customers.json"),
        isTreeBoxOpened = ko.observable(false);

    var treeBoxOptions = {
        value: ko.observable("1_1"),
        valueExpr: "ID",
        opened: isTreeBoxOpened,
        displayExpr: "name",
        placeholder: "Select a value...",
        showClearButton: true,
        dataSource: treeDataSource,
        treeView: {
            dataSource: treeDataSource,
            dataStructure: "plain",
            keyExpr: "ID",
            parentIdExpr: "categoryId",
            selectionMode: "single",
            onContentReady: function(e) {
                treeView = e.component;
                
                syncTreeViewSelection(treeView, treeBoxOptions.value());
            },
            onItemSelectionChanged: function(args){
                var nodes = args.component.getNodes(),
                    value = getSelectedItemsKeys(nodes);

                treeBoxOptions.value(value);
            },
            onItemClick: function(){
                isTreeBoxOpened(false);
            },
            displayExpr: "name",
            selectByClick: true,
            selectNodesRecursive: false
        }
    };
    
    var gridBoxValue = ko.observable(3),
        isGridBoxOpened = ko.observable(false);
    
    var gridBoxOptions = {
        value: gridBoxValue,
        opened: isGridBoxOpened,
        valueExpr: "ID",
        deferRendering: false,
        placeholder: "Select a value...",
        displayExpr: function(item){
            return item && item.CompanyName + " <" + item.Phone + ">";
        },
        showClearButton: true,
        dataSource: gridDataSource,
        dataGrid: {
            dataSource: gridDataSource,
            columns: ["CompanyName", "City", "Phone"],
            hoverStateEnabled: true,
            paging: { enabled: true, pageSize: 10 },
            filterRow: { visible: true },
            scrolling: { mode: "virtual" },
            selection: { mode: "single" },
            height: "100%",
            selectedRowKeys: ko.computed(function(){
                var editorValue = gridBoxValue();
                return (editorValue && [editorValue]) || [];
            }),
            onSelectionChanged: function(selectedItems){
                var hasSelection = selectedItems.selectedRowKeys.length;
                gridBoxValue(hasSelection ? selectedItems.selectedRowKeys[0] : null);
                isGridBoxOpened(false);
            }
        }
    };
    
    ko.computed(function(){
        syncTreeViewSelection(treeView, treeBoxOptions.value());
    });
    
    var viewModel = {
        treeBoxOptions: treeBoxOptions,
        gridBoxOptions: gridBoxOptions
    };
    
    ko.applyBindings(viewModel, document.getElementById("dropdown-box-demo"));
};

var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    
    var treeView;
    
    var syncTreeViewSelection = function(treeView){
        if (!treeView) return;
        
        if (!$scope.treeBoxValue) {
            treeView.unselectAll();
            return;
        }
        
        $scope.treeBoxValue.forEach(function(key){
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

    var treeDataSource = makeAsyncDataSource("treeProducts.json"),
        gridDataSource = makeAsyncDataSource("customers.json");
    
    $scope.treeBoxValue = ["1_1"];
    
    $scope.treeBoxOptions = {
        bindingOptions: {
            value: 'treeBoxValue'
        },
        valueExpr: "ID",
        displayExpr: "name",
        placeholder: "Select a value...",
        showClearButton: true,
        dataSource: treeDataSource,
        onValueChanged: function(){
            syncTreeViewSelection(treeView);
        },
        treeView: {
            dataSource: treeDataSource,
            dataStructure: "plain",
            keyExpr: "ID",
            parentIdExpr: "categoryId",
            displayExpr: "name",
            selectByClick: true,
            selectNodesRecursive: false,
            showCheckBoxesMode: "normal",
            bindingOptions: {
                selectionMode: "selectionMode"
            },
            onContentReady: function(e) {
                treeView = e.component;
                
                syncTreeViewSelection(treeView);
            },
            onItemSelectionChanged: function(args){
                $scope.treeBoxValue = args.component.getSelectedNodeKeys();
            }
        }
    };
    
    $scope.gridBoxValue = [3];
    
    $scope.gridBoxOptions = {
        bindingOptions: {
            value: "gridBoxValue"
        },
        valueExpr: "ID",
        placeholder: "Select a value...",
        displayExpr: "CompanyName",
        onValueChanged: function(e){
            $scope.gridBoxValue = e.value || [];
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
            height: 345,
            selection: { mode: "multiple" },
            bindingOptions: {
                "selectedRowKeys": "gridBoxValue"
            },
            onSelectionChanged: function(selectedItems){
                $scope.gridBoxValue = selectedItems.selectedRowKeys;
            }
        }
    };
});

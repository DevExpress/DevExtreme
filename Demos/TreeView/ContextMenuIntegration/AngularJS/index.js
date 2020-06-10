var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.selectedTreeItem = "";
    $scope.logItems = [];

    $scope.treeViewOptions = {
        items: products,
        width: 300,
        height: 450,
        onInitialized: function(e){
            $scope.treeView = e.component;
        },        
        onItemContextMenu: function(e) {
            $scope.selectedTreeItem = e.itemData;

            const isProduct = e.itemData.price !== undefined;
            $scope.contextMenu.option('items[0].visible', !isProduct);
            $scope.contextMenu.option('items[1].visible', !isProduct);
            $scope.contextMenu.option('items[2].visible', isProduct);
            $scope.contextMenu.option('items[3].visible', isProduct);

            $scope.contextMenu.option('items[0].disabled', e.node.expanded);
            $scope.contextMenu.option('items[1].disabled', !e.node.expanded);
        }
    };

    $scope.contextMenuOptions = {
        dataSource: menuItems,
        target: '#treeview .dx-treeview-item',
        onInitialized: function(e){
            $scope.contextMenu = e.component;
        },
        onItemClick: function(e) {
            let logEntry = '';
            switch(e.itemData.id) {
                case 'expand': {
                    logEntry = `The '${$scope.selectedTreeItem.text}' group was expanded`;
                    $scope.treeView.expandItem($scope.selectedTreeItem.id);
                    break;
                }
                case 'collapse': {
                    logEntry = `The '${$scope.selectedTreeItem.text}' group was collapsed`;
                    $scope.treeView.collapseItem($scope.selectedTreeItem.id);
                    break;
                }
                case 'details': {
                    logEntry = `Details about '${$scope.selectedTreeItem.text}' were displayed`;               
                    break;
                }
                case 'copy': {
                    logEntry = `Information about '${$scope.selectedTreeItem.text}' was copied`;
                    break;
                }
            }
            $scope.logItems.push(logEntry);
        }
    };   

    $scope.listOptions = {
        width: 400,
        height: 300,
        showScrollbar: "always",
        bindingOptions: {
            items: "logItems"
        }
    };    
});
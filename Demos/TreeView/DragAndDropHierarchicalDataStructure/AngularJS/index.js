var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.itemsDriveC = itemsDriveC;
    $scope.itemsDriveD = itemsDriveD;

    $scope.treeViewDriveCOptions = createTreeViewOptions('itemsDriveC', 'treeViewDriveC');
    $scope.treeViewDriveDOptions = createTreeViewOptions('itemsDriveD', 'treeViewDriveD');

    $scope.sortableDriveCOptions = createSortableOptions('driveC');
    $scope.sortableDriveDOptions = createSortableOptions('driveD');    

    function createTreeViewOptions(itemsName, treeViewName) {
        return {
            dataStructure: 'tree',
            expandNodesRecursive: false,
            width: 250,
            height: 380,
            itemTemplate: function(item) {
                var icon = item.isDirectory ? 'activefolder' : 'file';
                return "<div><i class=\"dx-icon dx-icon-" + icon +"\"></i><span>"  + item.name + "</span></div>";
            },
            onInitialized: function(e) {
                $scope[treeViewName] = e.component;
            },
            bindingOptions: {
                items: itemsName
            }            
        };
    };

    function createSortableOptions(driveName) {
        return {
            filter: ".dx-treeview-item",
            data: driveName,
            group: "shared",
            allowDropInsideItem: true,
            allowReordering: true,
            onDragChange: function(e) {
                if(e.fromComponent === e.toComponent) {
                    var fromNode = findNode(getTreeView(e.fromData), e.fromIndex);
                    var toNode = findNode(getTreeView(e.toData), calculateToIndex(e));
                    if (toNode !== null && isChildNode(fromNode, toNode)) {
                        e.cancel = true;
                    }
                }
            },        
            onDragEnd: function(e) {
                if(e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
                    return;
                }

                var fromTreeView = getTreeView(e.fromData);
                var toTreeView = getTreeView(e.toData);
    
                var fromNode = findNode(fromTreeView, e.fromIndex);
                var toNode = findNode(toTreeView, calculateToIndex(e));
    
                if(e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
                    return;
                }

                var fromTopVisibleNode = getTopVisibleNode(e.fromComponent);
                var toTopVisibleNode = getTopVisibleNode(e.toComponent);

                var fromItems = fromTreeView.option('items');
                var toItems = toTreeView.option('items');
                moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

                fromTreeView.option('items', fromItems);
                toTreeView.option('items', toItems);
                fromTreeView.scrollToItem(fromTopVisibleNode);
                toTreeView.scrollToItem(toTopVisibleNode);
            }
        };
    };

    
    function getTreeView(driveName) {
        return driveName === 'driveC'
            ? $scope.treeViewDriveC
            : $scope.treeViewDriveD;
    }

    function calculateToIndex(e) {
        if(e.fromComponent != e.toComponent || e.dropInsideItem) {
            return e.toIndex;
        }

        return e.fromIndex >= e.toIndex 
            ? e.toIndex 
            : e.toIndex + 1;
    }

    function findNode(treeView, index) {
        var visibleItems = [];
        buildVisibleNodesArray(treeView.getNodes(), visibleItems);
        if(visibleItems.length <= index) {
            return null;
        }

        return visibleItems[index];
    }

    function buildVisibleNodesArray(nodes, arrayContainer) {
        for(var i = 0; i < nodes.length; i++) {
            arrayContainer.push(nodes[i]);
            if(nodes[i].expanded !== false && nodes[i].children){
                buildVisibleNodesArray(nodes[i].children, arrayContainer);
            }
        }
    }

    function moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem) {
        var fromNodeContainingArray = getNodeContainingArray(fromNode, fromItems);
        var fromIndex = findIndex(fromNodeContainingArray, fromNode.itemData.id);
        fromNodeContainingArray.splice(fromIndex, 1);

        if(isDropInsideItem) {
            toNode.itemData.items.splice(toNode.itemData.items.length, 0, fromNode.itemData);
        } else {
            var toNodeContainingArray = getNodeContainingArray(toNode, toItems);
            var toIndex = toNode === null
                ? toItems.length 
                : findIndex(toNodeContainingArray, toNode.itemData.id);
            toNodeContainingArray.splice(toIndex, 0, fromNode.itemData);
        }
    }

    function getNodeContainingArray(node, rootArray) {
        return node === null || node.parent === null
            ? rootArray 
            : node.parent.itemData.items;
    }

    function findIndex(array, id) {
        var idsArray = array.map(function(elem) { return elem.id; });
        return idsArray.indexOf(id);
    }

    function isChildNode(parentNode, childNode) {
        var parent = childNode.parent;
        while(parent !== null) {
            if(parent.itemData.id === parentNode.itemData.id) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    }

    function getTopVisibleNode(component) {
        var treeViewElement = component.element().get(0);
        var treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
        var nodes = treeViewElement.querySelectorAll(".dx-treeview-node");
        for(var i = 0; i < nodes.length; i++) {
            var nodeTopPosition = nodes[i].getBoundingClientRect().top;
            if(nodeTopPosition >= treeViewTopPosition) {
                return nodes[i];
            }
        }

        return null;
    }
});
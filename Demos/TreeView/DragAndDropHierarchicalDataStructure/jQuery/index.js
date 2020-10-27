$(function() {
    createTreeView('#treeviewDriveC', itemsDriveC);
    createTreeView('#treeviewDriveD', itemsDriveD);

    createSortable('#treeviewDriveC', 'driveC');
    createSortable('#treeviewDriveD', 'driveD');
});

function createTreeView(selector, items) {
    $(selector).dxTreeView({
        items: items,
        expandNodesRecursive: false,
        dataStructure: 'tree',
        width: 250,
        height: 380,
        displayExpr: 'name'
    });
}

function createSortable(selector, driveName) {
    $(selector).dxSortable({
        filter: ".dx-treeview-item",
        data: driveName,
        group: "shared",
        allowDropInsideItem: true,
        allowReordering: true,
        onDragChange: function(e) {
            if(e.fromComponent === e.toComponent) {
                var $nodes = e.element.find(".dx-treeview-node");
                var isDragIntoChild = $nodes.eq(e.fromIndex).find($nodes.eq(e.toIndex)).length > 0;
                if(isDragIntoChild) {
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

            fromTreeView.option("items", fromItems);
            toTreeView.option("items", toItems);
            fromTreeView.scrollToItem(fromTopVisibleNode);
            toTreeView.scrollToItem(toTopVisibleNode);
        }
    });
}

function getTreeView(driveName) {
    return driveName === 'driveC'
        ? $('#treeviewDriveC').dxTreeView('instance')
        : $('#treeviewDriveD').dxTreeView('instance');
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
    var nodeElement = treeView.element().find('.dx-treeview-node')[index];
    if(nodeElement) {
        return findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id'));
    }
    return null;
}

function findNodeById(nodes, id) {
    for(var i = 0; i < nodes.length; i++) {
        if(nodes[i].itemData.id == id) {
            return nodes[i];
        }
        if(nodes[i].children) {
            var node = findNodeById(nodes[i].children, id);
            if(node != null) {
                return node;
            }
        }
    }
    return null;
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
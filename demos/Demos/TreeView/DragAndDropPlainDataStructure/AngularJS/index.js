const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.itemsDriveC = itemsDriveC;
  $scope.itemsDriveD = itemsDriveD;

  $scope.treeViewDriveCOptions = createTreeViewOptions('itemsDriveC', 'treeViewDriveC');
  $scope.treeViewDriveDOptions = createTreeViewOptions('itemsDriveD', 'treeViewDriveD');

  $scope.sortableDriveCOptions = createSortableOptions('driveC');
  $scope.sortableDriveDOptions = createSortableOptions('driveD');

  function createTreeViewOptions(itemsName, treeViewName) {
    return {
      dataStructure: 'plain',
      expandNodesRecursive: false,
      width: 250,
      height: 380,
      displayExpr: 'name',
      onInitialized(e) {
        $scope[treeViewName] = e.component;
      },
      bindingOptions: {
        items: itemsName,
      },
    };
  }

  function createSortableOptions(driveName) {
    return {
      filter: '.dx-treeview-item',
      data: driveName,
      group: 'shared',
      allowDropInsideItem: true,
      allowReordering: true,
      onDragChange(e) {
        if (e.fromComponent === e.toComponent) {
          const fromNode = findNode(getTreeView(e.fromData), e.fromIndex);
          const toNode = findNode(getTreeView(e.toData), calculateToIndex(e));
          if (toNode !== null && isChildNode(fromNode, toNode)) {
            e.cancel = true;
          }
        }
      },
      onDragEnd(e) {
        if (e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
          return;
        }

        const fromTreeView = getTreeView(e.fromData);
        const toTreeView = getTreeView(e.toData);

        const fromNode = findNode(fromTreeView, e.fromIndex);
        const toNode = findNode(toTreeView, calculateToIndex(e));

        if (e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
          return;
        }

        const fromTopVisibleNode = getTopVisibleNode(e.fromComponent);
        const toTopVisibleNode = getTopVisibleNode(e.toComponent);

        const fromItems = fromTreeView.option('items');
        const toItems = toTreeView.option('items');
        moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

        fromTreeView.option('items', fromItems);
        toTreeView.option('items', toItems);
        fromTreeView.scrollToItem(fromTopVisibleNode);
        toTreeView.scrollToItem(toTopVisibleNode);
      },
    };
  }

  function getTreeView(driveName) {
    return driveName === 'driveC'
      ? $scope.treeViewDriveC
      : $scope.treeViewDriveD;
  }

  function calculateToIndex(e) {
    if (e.fromComponent !== e.toComponent || e.dropInsideItem) {
      return e.toIndex;
    }

    return e.fromIndex >= e.toIndex
      ? e.toIndex
      : e.toIndex + 1;
  }

  function findNode(treeView, index) {
    const nodeElement = treeView.element().find('.dx-treeview-node')[index];
    if (nodeElement) {
      return findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id'));
    }
    return null;
  }

  function findNodeById(nodes, id) {
    for (let i = 0; i < nodes.length; i += 1) {
      if (nodes[i].itemData.id === id) {
        return nodes[i];
      }
      if (nodes[i].children) {
        const node = findNodeById(nodes[i].children, id);
        if (node != null) {
          return node;
        }
      }
    }
    return null;
  }

  function moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem) {
    const fromIndex = findIndex(fromItems, fromNode.itemData.id);
    fromItems.splice(fromIndex, 1);

    const toIndex = toNode === null || isDropInsideItem
      ? toItems.length
      : findIndex(toItems, toNode.itemData.id);
    toItems.splice(toIndex, 0, fromNode.itemData);

    moveChildren(fromNode, fromItems, toItems);
    if (isDropInsideItem) {
      fromNode.itemData.parentId = toNode.itemData.id;
    } else {
      fromNode.itemData.parentId = toNode != null
        ? toNode.itemData.parentId
        : undefined;
    }
  }

  function moveChildren(node, fromItems, toItems) {
    if (!node.itemData.isDirectory) {
      return;
    }

    node.children.forEach((child) => {
      if (child.itemData.isDirectory) {
        moveChildren(child, fromItems, toItems);
      }

      const fromIndex = findIndex(fromItems, child.itemData.id);
      fromItems.splice(fromIndex, 1);
      toItems.splice(toItems.length, 0, child.itemData);
    });
  }

  function findIndex(array, id) {
    const idsArray = array.map((elem) => elem.id);
    return idsArray.indexOf(id);
  }

  function isChildNode(parentNode, childNode) {
    let { parent } = childNode;
    while (parent !== null) {
      if (parent.itemData.id === parentNode.itemData.id) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  function getTopVisibleNode(component) {
    const treeViewElement = component.element().get(0);
    const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
    const nodes = treeViewElement.querySelectorAll('.dx-treeview-node');
    for (let i = 0; i < nodes.length; i += 1) {
      const nodeTopPosition = nodes[i].getBoundingClientRect().top;
      if (nodeTopPosition >= treeViewTopPosition) {
        return nodes[i];
      }
    }

    return null;
  }
});

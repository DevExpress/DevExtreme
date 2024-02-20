$(() => {
  createTreeView('#treeviewDriveC', itemsDriveC);
  createTreeView('#treeviewDriveD', itemsDriveD);

  createSortable('#treeviewDriveC', 'driveC');
  createSortable('#treeviewDriveD', 'driveD');
});

function createTreeView(selector, items) {
  $(selector).dxTreeView({
    items,
    expandNodesRecursive: false,
    dataStructure: 'tree',
    width: 250,
    height: 380,
    displayExpr: 'name',
  });
}

function createSortable(selector, driveName) {
  $(selector).dxSortable({
    filter: '.dx-treeview-item',
    data: driveName,
    group: 'shared',
    allowDropInsideItem: true,
    allowReordering: true,
    onDragChange(e) {
      if (e.fromComponent === e.toComponent) {
        const $nodes = e.element.find('.dx-treeview-node');
        const isDragIntoChild = $nodes.eq(e.fromIndex).find($nodes.eq(e.toIndex)).length > 0;
        if (isDragIntoChild) {
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
  });
}

function getTreeView(driveName) {
  return driveName === 'driveC'
    ? $('#treeviewDriveC').dxTreeView('instance')
    : $('#treeviewDriveD').dxTreeView('instance');
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
  const fromNodeContainingArray = getNodeContainingArray(fromNode, fromItems);
  const fromIndex = findIndex(fromNodeContainingArray, fromNode.itemData.id);
  fromNodeContainingArray.splice(fromIndex, 1);

  if (isDropInsideItem) {
    toNode.itemData.items.splice(toNode.itemData.items.length, 0, fromNode.itemData);
  } else {
    const toNodeContainingArray = getNodeContainingArray(toNode, toItems);
    const toIndex = toNode === null
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
  const idsArray = array.map((elem) => elem.id);
  return idsArray.indexOf(id);
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

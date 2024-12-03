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
    dataStructure: 'plain',
    width: 250,
    height: 380,
    displayExpr: 'name',
  });
}

function createSortable(selector, driveName) {
  $(selector).dxSortable({
    filter: '.dx-treeview-item',
    group: 'shared',
    data: driveName,
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

      const fromTopVisibleNode = getTopVisibleNode(fromTreeView);
      const toTopVisibleNode = getTopVisibleNode(toTreeView);

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

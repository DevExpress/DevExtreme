import React, { useCallback, useRef, useState } from 'react';
import TreeView from 'devextreme-react/tree-view';
import type { TreeViewTypes, TreeViewRef } from 'devextreme-react/tree-view';
import Sortable from 'devextreme-react/sortable';
import type { SortableTypes } from 'devextreme-react/sortable';

import { itemsDriveC as originItemsDriveC, itemsDriveD as originItemsDriveD } from './data.ts';
import type { FileSystemItem } from './types';
import { isDefined } from 'devextreme/core/utils/type';

type Node = TreeViewTypes.Node<FileSystemItem>;

const calculateToIndex = (e: SortableTypes.DragChangeEvent): number | undefined => {
  if (e.fromComponent !== e.toComponent || e.dropInsideItem) {
    return e.toIndex;
  }

  return (e.fromIndex && e.toIndex) && (e.fromIndex >= e.toIndex
    ? e.toIndex
    : e.toIndex + 1);
};

const findNode = (treeView: any, index: string | number | undefined): Node | null => {
  if (index === undefined) {
    return null;
  }
  const nodeElement = treeView.element().querySelectorAll('.dx-treeview-node')[index];
  if (nodeElement) {
    return findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id'));
  }
  return null;
};

const findNodeById = (nodes: Node[], id: string | number): Node | null => {
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i].itemData?.id === id) {
      return nodes[i];
    }
    if (nodes[i].children) {
      const node = findNodeById(nodes[i].children ?? [], id);
      if (node != null) {
        return node;
      }
    }
  }
  return null;
};

const moveNode = (fromNode: Node, toNode: Node, fromItems: FileSystemItem[], toItems: FileSystemItem[], isDropInsideItem: boolean): void => {
  if (!fromNode.itemData || !toNode.itemData) {
    return;
  }

  const fromNodeContainingArray = getNodeContainingArray(fromNode, fromItems);
  const fromIndex = fromNodeContainingArray?.findIndex((item: { id: any }): boolean => item.id === fromNode.itemData?.id);

  if (isDefined(fromIndex)) {
    fromNodeContainingArray?.splice(fromIndex, 1);
  }

  if (isDropInsideItem) {
    toNode.itemData?.items?.splice(toNode?.itemData?.items?.length, 0, fromNode.itemData);
  } else {
    const toNodeContainingArray = getNodeContainingArray(toNode, toItems);
    const toIndex = toNode === null
      ? toNodeContainingArray?.length
      : toNodeContainingArray?.findIndex((item: { id: any }): boolean => item.id === toNode.itemData?.id);
    if (isDefined(toIndex)) {
      toNodeContainingArray?.splice(toIndex, 0, fromNode.itemData);
    }
  }
};

const getNodeContainingArray = (node: Node, rootArray: FileSystemItem[]) => (
  !node?.parent
    ? rootArray
    : node.parent.itemData?.items
);

const isChildNode = (parentNode: Node, childNode: Node) => {
  let { parent } = childNode;
  while (parent !== null) {
    if (parent?.itemData?.id === parentNode.itemData?.id) {
      return true;
    }
    parent = parent?.parent;
  }
  return false;
};

const getTopVisibleNode = (component: any) => {
  const treeViewElement = component.element();
  const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
  const nodes = treeViewElement.querySelectorAll('.dx-treeview-node');
  for (let i = 0; i < nodes.length; i += 1) {
    const nodeTopPosition = nodes[i].getBoundingClientRect().top;
    if (nodeTopPosition >= treeViewTopPosition) {
      return nodes[i];
    }
  }

  return null;
};

const App = () => {
  const treeViewDriveCRef = useRef<TreeViewRef<FileSystemItem>>(null);
  const treeViewDriveDRef = useRef<TreeViewRef<FileSystemItem>>(null);

  const [itemsDriveC, setItemsDriveC] = useState<FileSystemItem[]>(originItemsDriveC);
  const [itemsDriveD, setItemsDriveD] = useState<FileSystemItem[]>(originItemsDriveD);

  const getTreeView = useCallback((driveName: string): ReturnType<TreeViewRef<FileSystemItem>['instance']> | undefined => (driveName === 'driveC'
    ? treeViewDriveCRef.current?.instance()
    : treeViewDriveDRef.current?.instance()), []);

  const onDragChange = useCallback((e: SortableTypes.DragChangeEvent): void => {
    if (e.fromComponent === e.toComponent) {
      const fromNode = findNode(getTreeView(e.fromData), e.fromIndex);
      const toNode = findNode(getTreeView(e.toData), calculateToIndex(e));
      if (fromNode !== null && toNode !== null && isChildNode(fromNode, toNode)) {
        e.cancel = true;
      }
    }
  }, [getTreeView]);

  const getStateFieldItems = useCallback((driveName: string) => (driveName === 'driveC'
    ? itemsDriveC
    : itemsDriveD), [itemsDriveC, itemsDriveD]);

  const onDragEnd = useCallback((e: SortableTypes.DragEndEvent): void => {
    if (e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
      return;
    }

    const fromTreeView = getTreeView(e.fromData);
    const toTreeView = getTreeView(e.toData);

    const fromNode = findNode(fromTreeView, e.fromIndex);
    const toNode = findNode(toTreeView, calculateToIndex(e));

    if (e.dropInsideItem && toNode !== null && !toNode.itemData?.isDirectory) {
      return;
    }

    const fromTopVisibleNode = getTopVisibleNode(e.fromComponent);
    const toTopVisibleNode = getTopVisibleNode(e.toComponent);

    const fromItems = getStateFieldItems(e.fromData);
    const toItems = getStateFieldItems(e.toData);

    if (fromNode && toNode) {
      moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);
    }

    setItemsDriveC([...fromItems]);
    setItemsDriveD([...toItems]);
    fromTreeView?.scrollToItem(fromTopVisibleNode);
    toTreeView?.scrollToItem(toTopVisibleNode);
  }, [getTreeView, getStateFieldItems]);

  return (
    <div className="form">
      <div className="drive-panel">
        <div className="drive-header dx-treeview-item"><div className="dx-treeview-item-content"><i className="dx-icon dx-icon-activefolder"></i><span>Drive C:</span></div></div>
        <Sortable
          filter=".dx-treeview-item"
          group="shared"
          data="driveC"
          allowDropInsideItem={true}
          allowReordering={true}
          onDragChange={onDragChange}
          onDragEnd={onDragEnd}>
          <TreeView
            id="treeviewDriveC"
            expandNodesRecursive={false}
            dataStructure="tree"
            ref={treeViewDriveCRef}
            items={itemsDriveC}
            width={250}
            height={380}
            displayExpr="name"
          />
        </Sortable>
      </div>
      <div className="drive-panel">
        <div className="drive-header dx-treeview-item"><div className="dx-treeview-item-content"><i className="dx-icon dx-icon-activefolder"></i><span>Drive D:</span></div></div>
        <Sortable
          filter=".dx-treeview-item"
          group="shared"
          data="driveD"
          allowDropInsideItem={true}
          allowReordering={true}
          onDragChange={onDragChange}
          onDragEnd={onDragEnd}>
          <TreeView
            id="treeviewDriveD"
            expandNodesRecursive={false}
            dataStructure="tree"
            ref={treeViewDriveDRef}
            items={itemsDriveD}
            width={250}
            height={380}
            displayExpr="name"
          />
        </Sortable>
      </div>
    </div>
  );
};

export default App;

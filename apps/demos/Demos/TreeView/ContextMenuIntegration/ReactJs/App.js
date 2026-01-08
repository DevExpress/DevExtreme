import React, { useCallback, useRef, useState } from 'react';
import { TreeView } from 'devextreme-react/tree-view';
import { ContextMenu } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import { products, menuItems } from './data.js';

const App = () => {
  const [contextMenuItems, setContextMenuItems] = useState(menuItems);
  const [logItems, setLogItems] = useState([]);
  const [selectedTreeItem, setSelectedTreeItem] = useState(undefined);
  const treeViewRef = useRef(null);
  const treeViewItemContextMenu = useCallback((e) => {
    setSelectedTreeItem(e.itemData);
    const isProductItem = !e.itemData?.items;
    const isExpanded = e.node?.expanded;
    setContextMenuItems((prev) =>
      prev.map((item, index) => {
        switch (index) {
          case 0:
            return {
              ...item,
              visible: !isProductItem,
              disabled: isExpanded,
            };
          case 1:
            return {
              ...item,
              visible: !isProductItem,
              disabled: !isExpanded,
            };
          case 2:
          case 3:
            return {
              ...item,
              visible: isProductItem,
            };
          default:
            return item;
        }
      }),
    );
  }, []);
  const contextMenuItemClick = useCallback(
    (e) => {
      let logEntry = '';
      switch (e.itemData?.id) {
        case 'expand': {
          logEntry = `The '${selectedTreeItem?.text}' group was expanded`;
          treeViewRef.current?.instance().expandItem(selectedTreeItem?.id);
          break;
        }
        case 'collapse': {
          logEntry = `The '${selectedTreeItem?.text}' group was collapsed`;
          treeViewRef.current?.instance().collapseItem(selectedTreeItem?.id);
          break;
        }
        case 'details': {
          logEntry = `Details about '${selectedTreeItem?.text}' were displayed`;
          break;
        }
        case 'copy': {
          logEntry = `Information about '${selectedTreeItem?.text}' was copied`;
          break;
        }
        default:
          break;
      }
      const updatedLogItems = [...logItems, logEntry];
      setLogItems(updatedLogItems);
    },
    [logItems, selectedTreeItem],
  );
  return (
    <div className="form">
      <TreeView
        id="treeview"
        ref={treeViewRef}
        items={products}
        width={300}
        height={450}
        onItemContextMenu={treeViewItemContextMenu}
      />
      <div className="log-container">
        <div>
          <i className="icon dx-icon-clock"></i>
          <span>&nbsp;Operations log:</span>
        </div>
        <List
          id="log"
          width={400}
          height={300}
          showScrollbar="always"
          items={logItems}
        />
      </div>
      <ContextMenu
        dataSource={contextMenuItems}
        target="#treeview .dx-treeview-item"
        onItemClick={contextMenuItemClick}
      />
    </div>
  );
};
export default App;

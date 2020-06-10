import React from 'react';
import { TreeView, ContextMenu, List } from 'devextreme-react';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.contextMenuRef = React.createRef();
    this.treeViewRef = React.createRef();

    this.state = {
      products: service.getProducts(),
      menuItems: service.getMenuItems(),
      logItems: [],
      selectedTreeItem: undefined
    };

    this.treeViewItemContextMenu = this.treeViewItemContextMenu.bind(this);
    this.contextMenuItemClick = this.contextMenuItemClick.bind(this);
  }

  render() {
    return (
      <div className="form">
        <TreeView id="treeview"
          ref={this.treeViewRef}
          items={this.state.products}
          width={300}
          height={450}
          onItemContextMenu={this.treeViewItemContextMenu} />
        <div className="log-container">
          <div><i className="icon dx-icon-clock"></i>&nbsp;Operations log:</div>
          <List
            id="log"
            width={400}
            height={300}
            showScrollbar="always"
            items={this.state.logItems} />
        </div>
        <ContextMenu
          ref={this.contextMenuRef}
          dataSource={this.state.menuItems}
          target="#treeview .dx-treeview-item"
          onItemClick={this.contextMenuItemClick} />
      </div>
    );
  }

  get treeView() {
    return this.treeViewRef.current.instance;
  }

  get contextMenu() {
    return this.contextMenuRef.current.instance;
  }

  treeViewItemContextMenu(e) {
    this.setState({
      selectedTreeItem: e.itemData,
    });

    const isProduct = e.itemData.price !== undefined;
    this.contextMenu.option('items[0].visible', !isProduct);
    this.contextMenu.option('items[1].visible', !isProduct);
    this.contextMenu.option('items[2].visible', isProduct);
    this.contextMenu.option('items[3].visible', isProduct);

    this.contextMenu.option('items[0].disabled', e.node.expanded);
    this.contextMenu.option('items[1].disabled', !e.node.expanded);
  }

  contextMenuItemClick(e) {
    let logEntry = '';
    switch(e.itemData.id) {
      case 'expand': {
        logEntry = `The '${this.state.selectedTreeItem.text}' group was expanded`;
        this.treeView.expandItem(this.state.selectedTreeItem.id);
        break;
      }
      case 'collapse': {
        logEntry = `The '${this.state.selectedTreeItem.text}' group was collapsed`;
        this.treeView.collapseItem(this.state.selectedTreeItem.id);
        break;
      }
      case 'details': {
        logEntry = `Details about '${this.state.selectedTreeItem.text}' were displayed`;
        break;
      }
      case 'copy': {
        logEntry = `Information about '${this.state.selectedTreeItem.text}' was copied`;
        break;
      }
    }
    const logItems = this.state.logItems.concat([logEntry]);

    this.setState({
      logItems: logItems
    });
  }
}

export default App;

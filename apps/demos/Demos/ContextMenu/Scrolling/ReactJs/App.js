import React from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import notify from 'devextreme/ui/notify';
import { contextMenuItems as items } from './data.js';

function itemClick(e) {
  if (!e.itemData.items) {
    notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
  }
}
function App() {
  return (
    <React.Fragment>
      <div className="target-area">
        Right click within this region to display the DevExtreme Context Menu
      </div>
      <ContextMenu
        dataSource={items}
        width={200}
        target=".target-area"
        onItemClick={itemClick}
      />
    </React.Fragment>
  );
}
export default App;

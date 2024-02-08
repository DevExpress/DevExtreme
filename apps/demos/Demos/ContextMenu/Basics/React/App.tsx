import React, { useEffect } from 'react';
import ContextMenu, { ContextMenuTypes } from 'devextreme-react/context-menu';
import notify from 'devextreme/ui/notify';
import { contextMenuItems as items } from './data.ts';

function itemClick(e: ContextMenuTypes.ItemClickEvent) {
  if (!e.itemData.items) {
    notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
  }
}

function App() {
  useEffect(() => {
    const image = document.getElementById('image');
    if (image) {
      image.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
    }
  }, []);

  return (
    <React.Fragment>
      <div className="label">
        Right click the image to show available actions:
      </div>
      <img id="image" alt="product" src="../../../../images/products/7.png" />
      <ContextMenu
        dataSource={items}
        width={200}
        target="#image"
        onItemClick={itemClick}
      />
    </React.Fragment>
  );
}

export default App;

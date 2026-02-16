import React, { useEffect } from 'react';

import { ContextMenu, type ContextMenuTypes } from 'devextreme-react/context-menu';
import notify from 'devextreme/ui/notify';

import { contextMenuItems as items } from './data.ts';
import type { ContextMenuItem } from './types';

function itemClick(e: ContextMenuTypes.ItemClickEvent<ContextMenuItem>): void {
  if (!e.itemData?.items) {
    notify(`The "${e.itemData?.text}" item was clicked`, 'success', 1500);
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
    <>
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
    </>
  );
}

export default App;

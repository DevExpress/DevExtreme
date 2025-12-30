import React, { useCallback, useState } from 'react';
import TreeView, { type TreeViewTypes } from 'devextreme-react/tree-view';

import { products } from './data.ts';
import type { Product } from './types.ts';

const App = () => {
  const [currentItem, setCurrentItem] = useState<Product>(products[0]);

  const selectItem = useCallback((e: TreeViewTypes.ItemClickEvent<Product>): void => {
    if (!e.itemData) {
      return;
    }

    setCurrentItem({ ...e.itemData });
  }, []);

  return (
    <div className="form">
      <TreeView
        id="simple-treeview"
        items={products}
        dataStructure="plain"
        displayExpr="name"
        parentIdExpr="categoryId"
        keyExpr="ID"
        width={300}
        onItemClick={selectItem}
      />
      {currentItem.price && (
        <div id="product-details">
          <img alt={currentItem.name} src={currentItem.icon} />
          <div className="name">{currentItem.name}</div>
          <div className="price">{`$${currentItem.price}`}</div>
        </div>
      )}
    </div>
  );
};

export default App;

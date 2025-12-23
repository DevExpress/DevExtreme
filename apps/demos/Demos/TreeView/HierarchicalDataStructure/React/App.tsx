import React, { useCallback, useState } from 'react';
import TreeView from 'devextreme-react/tree-view';
import type { TreeViewTypes } from 'devextreme-react/tree-view';

import { products } from './data.ts';
import type { Product } from './types.ts';

const App = () => {
  const [currentItem, setCurrentItem] = useState<Product>({ ...products[0] });

  const selectItem = useCallback((e: TreeViewTypes.ItemClickEvent<Product>): void => {
    setCurrentItem({ ...e.itemData });
  }, []);

  return (
    <div className="form">
      <TreeView id="simple-treeview"
        items={products}
        width={300}
        onItemClick={selectItem} />
      {currentItem.price
        && <div id="product-details">
          <img src={currentItem.image} alt="Product image" />
          <div className="name">{currentItem.text}</div>
          <div className="price">{`$${currentItem.price}`}</div>
        </div>
      }
    </div>
  );
};

export default App;

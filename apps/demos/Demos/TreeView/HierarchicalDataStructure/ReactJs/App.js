import React, { useCallback, useState } from 'react';
import TreeView from 'devextreme-react/tree-view';
import { products } from './data.js';

const App = () => {
  const [currentItem, setCurrentItem] = useState({ ...products[0] });
  const selectItem = useCallback((e) => {
    setCurrentItem({ ...e.itemData });
  }, []);
  return (
    <div className="form">
      <TreeView
        id="simple-treeview"
        items={products}
        width={300}
        onItemClick={selectItem}
      />
      {currentItem.price && (
        <div id="product-details">
          <img
            src={currentItem.image}
            alt="Product image"
          />
          <div className="name">{currentItem.text}</div>
          <div className="price">{`$${currentItem.price}`}</div>
        </div>
      )}
    </div>
  );
};
export default App;

import React, { useCallback, useState } from 'react';
import TreeView from 'devextreme-react/tree-view';
import service from './data.js';

const products = service.getProducts();
const App = () => {
  const [currentItem, setCurrentItem] = useState(products[0]);
  const selectItem = useCallback(
    (e) => {
      setCurrentItem({ ...e.itemData });
    },
    [setCurrentItem],
  );
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
          <img
            alt={currentItem.name}
            src={currentItem.icon}
          />
          <div className="name">{currentItem.name}</div>
          <div className="price">{`$${currentItem.price}`}</div>
        </div>
      )}
    </div>
  );
};
export default App;

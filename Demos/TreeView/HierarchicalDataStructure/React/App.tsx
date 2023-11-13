import React from 'react';
import TreeView, { TreeViewTypes } from 'devextreme-react/tree-view';
import service, { ProductType } from './data.ts';

const products = service.getProducts();

const App = () => {
  const [currentItem, setCurrentItem] = React.useState({ ...products[0] });

  const selectItem = React.useCallback((e: TreeViewTypes.ItemClickEvent & { itemData?: ProductType; }) => {
    setCurrentItem({ ...e.itemData });
  }, [setCurrentItem]);

  return (
    <div className="form">
      <TreeView id="simple-treeview"
        items={products}
        width={300}
        onItemClick={selectItem} />
      {currentItem.price
        && <div id="product-details">
          <img src={currentItem.image} />
          <div className="name">{currentItem.text}</div>
          <div className="price">{`$${currentItem.price}`}</div>
        </div>
      }
    </div>
  );
};

export default App;

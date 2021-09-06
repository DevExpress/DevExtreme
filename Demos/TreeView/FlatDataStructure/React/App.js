import React from 'react';
import TreeView from 'devextreme-react/tree-view';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.products = service.getProducts();
    this.state = {
      currentItem: { ...this.products[0] },
    };
    this.selectItem = this.selectItem.bind(this);
  }

  render() {
    const { currentItem } = this.state;
    return (
      <div className="form">
        <TreeView id="simple-treeview"
          items={this.products}
          dataStructure="plain"
          displayExpr="name"
          parentIdExpr="categoryId"
          keyExpr="ID"
          width={300}
          onItemClick={this.selectItem} />
        {currentItem.price
          && <div id="product-details">
            <img src={currentItem.icon} />
            <div className="name">{currentItem.name}</div>
            <div className="price">{`$${currentItem.price}`}</div>
          </div>
        }
      </div>
    );
  }

  selectItem(e) {
    this.setState({
      currentItem: { ...e.itemData },
    });
  }
}

export default App;

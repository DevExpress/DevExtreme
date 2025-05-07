import React from 'react';
import List from 'devextreme-react/list';
import ProductInfo from './ProductInfo.js';
import { products } from './data.js';

const App = () => (
  <div className="list-container">
    <List
      dataSource={products}
      height="100%"
      displayExpr="Name"
      itemRender={ProductInfo}
    />
  </div>
);
export default App;

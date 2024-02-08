import React from 'react';
import List from 'devextreme-react/list';
import ProductInfo from './ProductInfo.tsx';
import { products } from './data.ts';

const App = () => (
  <div className="list-container">
    <List
      dataSource={products}
      height="100%"
      itemRender={ProductInfo} />
  </div>
);

export default App;

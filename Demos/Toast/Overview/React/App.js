import React from 'react';

import { ProductItem } from './ProductItem.js';
import { products } from './data.js';

class App extends React.Component {

  render() {

    const items = products.map((product) => (
      <li key={product.ID}>
        <ProductItem product={product} />
      </li>
    ));

    return (
      <div id="toast">

        <h1>Product List</h1>

        <ul>{items}</ul>
      </div>
    );
  }

}

export default App;

import React from 'react';
import { Toast } from 'devextreme-react/toast';

import { ProductItem } from './ProductItem.js';
import { products } from './data.js';

function App() {
  const [toastConfig, setToastConfig] = React.useState({
    isVisible: false,
    type: 'info',
    message: ''
  });

  const items = products.map((product) => (
    <li key={product.ID}>
      <ProductItem product={product} checkAvailability={checkAvailability} />
    </li>
  ));

  return (
    <div id="productList">
      <h1>Product List</h1>
      <ul>{items}</ul>
      <Toast
        visible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHiding={onHiding}
        displayTime={600}
      />
    </div>
  );

  function checkAvailability(e, product) {
    const type = e.value ? 'success' : 'error';
    const message =
      product.Name + (e.value ? ' is available' : ' is not available');

    setToastConfig({
      ...toastConfig,
      isVisible: true,
      type,
      message
    });
  }

  function onHiding() {
    setToastConfig({
      ...toastConfig,
      isVisible: false
    });
  }
}

export default App;

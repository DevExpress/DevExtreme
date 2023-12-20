import React, { useCallback, useState } from 'react';
import { Toast } from 'devextreme-react/toast';
import { ProductItem } from './ProductItem.js';
import { products } from './data.js';

function App() {
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    type: 'info',
    message: '',
  });
  const checkAvailability = useCallback(
    (e, product) => {
      const type = e.value ? 'success' : 'error';
      const message = product.Name + (e.value ? ' is available' : ' is not available');
      setToastConfig({
        ...toastConfig,
        isVisible: true,
        type,
        message,
      });
    },
    [toastConfig, setToastConfig],
  );
  const onHiding = useCallback(() => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  }, [toastConfig, setToastConfig]);
  const items = products.map((product) => (
    <li key={product.ID}>
      <ProductItem
        product={product}
        checkAvailability={checkAvailability}
      />
    </li>
  ));
  return (
    <div id="product-list">
      <div className="header">Product List</div>
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
}
export default App;

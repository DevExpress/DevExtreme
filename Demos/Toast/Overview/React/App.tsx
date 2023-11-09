import React from 'react';
import { Toast } from 'devextreme-react/toast';

import { ProductItem } from './ProductItem.tsx';
import { products } from './data.ts';

function App() {
  const [toastConfig, setToastConfig] = React.useState({
    isVisible: false,
    type: 'info',
    message: '',
  } as {
    isVisible: boolean,
    type: 'info' | 'error' | 'success',
    message: string,
  });

  const checkAvailability = React.useCallback((e: { value: any; }, product: { Name: string | number; }) => {
    const type = e.value ? 'success' : 'error';
    const message = product.Name + (e.value ? ' is available' : ' is not available');

    setToastConfig({
      ...toastConfig,
      isVisible: true,
      type,
      message,
    });
  }, [toastConfig, setToastConfig]);

  const onHiding = React.useCallback(() => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  }, [toastConfig, setToastConfig]);

  const items = products.map((product) => (
    <li key={product.ID}>
      <ProductItem product={product} checkAvailability={checkAvailability} />
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

import React, { useCallback, useState } from 'react';
import { Toast } from 'devextreme-react/toast';
import type { ToastTypes } from 'devextreme-react/toast';
import type { CheckBoxTypes } from 'devextreme-react/check-box';

import { ProductItem } from './ProductItem.tsx';
import { products } from './data.ts';
import type { Product, ToastConfig } from './types.ts';

function App() {
  const [toastConfig, setToastConfig] = useState<ToastConfig>({
    isVisible: false,
    type: 'info',
    message: '',
  });

  const checkAvailability = useCallback((e: CheckBoxTypes.ValueChangedEvent, product: Product): void => {
    const type: ToastTypes.ToastType = e.value ? 'success' : 'error';
    const message = product.Name + (e.value ? ' is available' : ' is not available');

    setToastConfig({
      ...toastConfig,
      isVisible: true,
      type,
      message,
    });
  }, [toastConfig]);

  const onHiding = useCallback(() => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  }, [toastConfig]);

  const items = products.map((product: Product) => (
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

import React, { useCallback } from 'react';

import { CheckBox } from 'devextreme-react/check-box';
import type { CheckBoxTypes } from 'devextreme-react/check-box';

import type { Product } from './types.ts';

interface ProductItemProps {
  product: Product;
  checkAvailability: (e: CheckBoxTypes.ValueChangedEvent, product: Product) => void;
}

export function ProductItem({ product, checkAvailability }: ProductItemProps) {
  const onValueChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent): void => {
    checkAvailability(e, product);
  }, [product, checkAvailability]);

  return (
    <>
      <img alt={product.Name} src={product.ImageSrc} />
      <div>{product.Name}</div>
      <CheckBox
        text="Available"
        onValueChanged={onValueChanged}
      />
    </>
  );
}

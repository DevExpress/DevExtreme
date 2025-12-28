import React, { useCallback } from 'react';
import { CheckBox } from 'devextreme-react/check-box';

export function ProductItem({ product, checkAvailability }) {
  const onValueChanged = useCallback(
    (e) => {
      checkAvailability(e, product);
    },
    [product, checkAvailability],
  );
  return (
    <>
      <img
        alt={product.Name}
        src={product.ImageSrc}
      />
      <div>{product.Name}</div>
      <CheckBox
        text="Available"
        onValueChanged={onValueChanged}
      />
    </>
  );
}

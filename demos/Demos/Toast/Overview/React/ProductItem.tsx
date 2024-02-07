import React, { useCallback } from 'react';

import { CheckBox } from 'devextreme-react/check-box';

interface ProductItemProps {
  product: { ID: number; Name: string; Price: number; Current_Inventory: number; Backorder: number; Manufacturing: number; Category: string; ImageSrc: string; };
  checkAvailability: any;
}

export function ProductItem(props: ProductItemProps) {
  const onValueChanged = useCallback((e) => {
    props.checkAvailability(e, props.product);
  }, [props]);

  return (
    <React.Fragment>
      <img alt={props.product.Name} src={props.product.ImageSrc} />
      <div>{props.product.Name}</div>
      <CheckBox
        text="Available"
        onValueChanged={onValueChanged}
      />
    </React.Fragment>
  );
}

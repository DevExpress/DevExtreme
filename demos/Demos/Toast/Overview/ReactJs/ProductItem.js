import React, { useCallback } from 'react';
import { CheckBox } from 'devextreme-react/check-box';

export function ProductItem(props) {
  const onValueChanged = useCallback(
    (e) => {
      props.checkAvailability(e, props.product);
    },
    [props],
  );
  return (
    <React.Fragment>
      <img
        alt={props.product.Name}
        src={props.product.ImageSrc}
      />
      <div>{props.product.Name}</div>
      <CheckBox
        text="Available"
        onValueChanged={onValueChanged}
      />
    </React.Fragment>
  );
}

import React from 'react';

import { CheckBox } from 'devextreme-react/check-box';

export function ProductItem(props) {
  const onValueChanged = React.useCallback((e) => {
    props.checkAvailability(e, props.product);
  }, []);

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

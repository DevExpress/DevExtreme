import React from 'react';

import { CheckBox } from 'devextreme-react/check-box';

export function ProductItem(props) {
  const onValueChanged = React.useCallback((e) => {
    props.checkAvailability(e, props.product);
  }, []);

  return (
    <React.Fragment>
      <img src={props.product.ImageSrc} alt="monitor" />
      <div>{props.product.Name}</div>
      <CheckBox
        text="Available"
        onValueChanged={onValueChanged}
      />
    </React.Fragment>
  );
}

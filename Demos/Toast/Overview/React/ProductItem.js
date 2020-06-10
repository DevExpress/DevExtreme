import React from 'react';

import notify from 'devextreme/ui/notify';
import { CheckBox } from 'devextreme-react/check-box';

export class ProductItem extends React.Component {

  constructor(props) {
    super(props);

    this.checkAvailability = (e) => {
      const type = e.value ? 'success' : 'error';
      const text = props.product.Name + (e.value ? ' is available' : ' is not available');

      notify(text, type, 600);
    };
  }

  render() {
    return (
      <React.Fragment>
        <img src={this.props.product.ImageSrc} /><br />
        <div id="name">{this.props.product.Name}</div>
        <CheckBox
          text="Available"
          onValueChanged={this.checkAvailability}
        />
      </React.Fragment>
    );
  }
}

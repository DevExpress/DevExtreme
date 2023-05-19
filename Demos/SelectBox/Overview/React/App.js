import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import ArrayStore from 'devextreme/data/array_store';
import notify from 'devextreme/ui/notify';

import service from './data.js';
import Field from './Field.js';
import Item from './Item.js';

const simpleProductLabel = { 'aria-label': 'Simple Product' };
const productIDLabel = { 'aria-label': 'Product ID' };
const productWithPlaceholderLabel = { 'aria-label': 'Product With Placeholder' };
const productLabel = { 'aria-label': 'Product' };
const readOnlyProductLabel = { 'aria-label': 'ReadOnly Product' };
const templatedProductLabel = { 'aria-label': 'Templated Product' };
const disabledProductLabel = { 'aria-label': 'Disabled Product' };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.products = service.getProducts();
    this.simpleProducts = service.getSimpleProducts();
    this.data = new ArrayStore({
      data: this.products,
      key: 'ID',
    });
    this.state = {
      value: this.simpleProducts[0],
    };
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  onValueChanged(e) {
    this.setState({
      value: e.value,
    });
    notify(`The value is changed to: "${e.value}"`);
  }

  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Default mode</div>
            <div className="dx-field-value">
              <SelectBox items={this.simpleProducts} inputAttr={simpleProductLabel} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With a custom placeholder</div>
            <div className="dx-field-value">
              <SelectBox items={this.simpleProducts}
                placeholder="Choose Product"
                inputAttr={productWithPlaceholderLabel}
                showClearButton={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Read only</div>
            <div className="dx-field-value">
              <SelectBox items={this.simpleProducts}
                defaultValue={this.simpleProducts[0]}
                inputAttr={readOnlyProductLabel}
                readOnly={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <SelectBox items={this.simpleProducts}
                inputAttr={disabledProductLabel}
                defaultValue={this.simpleProducts[0]}
                disabled={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Data source usage</div>
            <div className="dx-field-value">
              <SelectBox dataSource={this.data}
                displayExpr="Name"
                inputAttr={productIDLabel}
                valueExpr="ID"
                defaultValue={this.products[0].ID} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Custom templates</div>
            <div className="dx-field-value">
              <SelectBox id="custom-templates"
                dataSource={this.products}
                displayExpr="Name"
                inputAttr={templatedProductLabel}
                valueExpr="ID"
                defaultValue={this.products[3].ID}
                fieldRender={Field}
                itemRender={Item} />
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Event Handling</div>
          <div className="dx-field">
            <div className="dx-field-label">Product</div>
            <div className="dx-field-value">
              <SelectBox items={this.simpleProducts}
                value={this.state.value}
                inputAttr={productLabel}
                onValueChanged={this.onValueChanged} />
            </div>
          </div>
          <div className="current-value">
        Selected product is <span>{this.state.value}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

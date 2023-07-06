import React from 'react';

import TagBox from 'devextreme-react/tag-box';
import Popover from 'devextreme-react/popover';
import ArrayStore from 'devextreme/data/array_store';

import Item from './Item.js';
import Tag from './Tag.js';
import { simpleProducts, products, productLabel } from './data.js';

const disabledValue = [simpleProducts[0]];

class App extends React.Component {
  constructor() {
    super();
    this.dataSource = new ArrayStore({
      data: products,
      key: 'Id',
    });
    this.state = {
      editableProducts: [...simpleProducts],
      value: [1, 2],
      target: null,
      product: {},
    };
    this.onCustomItemCreating = this.onCustomItemCreating.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
  }

  onCustomItemCreating(args) {
    const newValue = args.text;
    const isItemInDataSource = this.state.editableProducts.some((item) => item === newValue);
    if (!isItemInDataSource) {
      this.setState({
        editableProducts: [newValue, ...this.state.editableProducts],
      });
    }
    args.customItem = newValue;
  }

  onMouseEnter(e, product) {
    this.setState({
      target: e.currentTarget,
      product,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Default mode</div>
            <div className="dx-field-value">
              <TagBox items={simpleProducts} inputAttr={productLabel} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Search mode</div>
            <div className="dx-field-value">
              <TagBox items={simpleProducts}
                searchEnabled={true}
                inputAttr={productLabel}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Batch selection</div>
            <div className="dx-field-value">
              <TagBox items={simpleProducts}
                showSelectionControls={true}
                inputAttr={productLabel}
                applyValueMode="useButtons" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Hide selected items</div>
            <div className="dx-field-value">
              <TagBox items={simpleProducts}
                inputAttr={productLabel}
                hideSelectedItems={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Single line mode</div>
            <div className="dx-field-value">
              <TagBox items={simpleProducts}
                inputAttr={productLabel}
                multiline={false} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Add custom items</div>
            <div className="dx-field-value">
              <TagBox items={this.state.editableProducts}
                inputAttr={productLabel}
                acceptCustomValue={true}
                onCustomItemCreating={this.onCustomItemCreating} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">With custom placeholder</div>
            <div className="dx-field-value">
              <TagBox items={simpleProducts}
                inputAttr={productLabel}
                placeholder="Choose Product..." />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <TagBox items={simpleProducts}
                inputAttr={productLabel}
                value={disabledValue}
                disabled={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Data source</div>
            <div className="dx-field-value">
              <TagBox dataSource={this.dataSource}
                inputAttr={productLabel}
                displayExpr="Name"
                valueExpr="Id" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Custom template</div>
            <div className="dx-field-value">
              <TagBox dataSource={this.dataSource}
                defaultValue={this.state.value}
                inputAttr={productLabel}
                displayExpr="Name"
                valueExpr="Id"
                itemRender={Item}
                tagRender={(data) => <Tag product={data} onMouseEnter={this.onMouseEnter} />} />

              <Popover
                showEvent="mouseenter"
                hideEvent="mouseleave"
                target={this.state.target}
              >
                <p>
                  <b>Name: </b><span>{ this.state.product.Name }</span>
                </p>
                <p>
                  <b>Price: </b><span>{ this.state.product.Price }</span>
                </p>
                <p>
                  <b>In-stock: </b><span>{ this.state.product.Current_Inventory }</span>
                </p>
                <p>
                  <b>Category: </b><span>{ this.state.product.Category }</span>
                </p>
              </Popover>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;

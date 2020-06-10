import React from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import { NumberBox } from 'devextreme-react/number-box';
import { CheckBox } from 'devextreme-react/check-box';
import DataSource from 'devextreme/data/data_source';

import { simpleProducts, products } from './data.js';

const searchExprItems = [{
  name: "'Name'",
  value: 'Name'
}, {
  name: "['Name', 'Category']",
  value: ['Name', 'Category']
}];
const productsDataSource = new DataSource({
  store: {
    data: simpleProducts,
    type: 'array',
    key: 'ID'
  }
});

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      editBoxValue: simpleProducts[0],
      searchModeOption: 'contains',
      searchExprOption: 'Name',
      searchTimeoutOption: 200,
      minSearchLengthOption: 0,
      showDataBeforeSearchOption: false

    };
    this.editBoxValueChanged = ({ value }) => {
      this.setState({ editBoxValue: value });
    };
    this.searchModeOptionChanged = ({ value }) => {
      this.setState({ searchModeOption: value });
    };
    this.searchExprOptionChanged = ({ value }) => {
      this.setState({ searchExprOption: value });
    };
    this.searchTimeoutOptionChanged = ({ value }) => {
      this.setState({ searchTimeoutOption: value });
    };
    this.minSearchLengthOptionChanged = ({ value }) => {
      this.setState({ minSearchLengthOption: value });
    };
    this.showDataBeforeSearchOptionChanged = ({ value }) => {
      this.setState({ showDataBeforeSearchOption: value });
    };
  }

  customItemCreating(args) {
    if(!args.text) {
      args.customItem = null;
      return;
    }

    const productIds = simpleProducts.map(function(item) {
      return item.ID;
    });
    const incrementedId = Math.max.apply(null, productIds) + 1;
    const newItem = {
      Name: args.text,
      ID: incrementedId
    };

    productsDataSource.store().insert(newItem);
    productsDataSource.load();
    args.customItem = newItem;
  }

  render() {
    return (
      <div id="selectbox-demo">
        <div className="widget-container">
          <div className="dx-fieldset">
            <div className="dx-fieldset-header">SearchBox</div>
            <div className="dx-field">
              <div className="dx-field-label">Product</div>
              <div className="dx-field-value">
                <SelectBox dataSource={products}
                  displayExpr="Name"
                  searchEnabled={true}
                  searchMode={this.state.searchModeOption}
                  searchExpr={this.state.searchExprOption}
                  searchTimeout={this.state.searchTimeoutOption}
                  minSearchLength={this.state.minSearchLengthOption}
                  showDataBeforeSearch={this.state.showDataBeforeSearchOption} />
              </div>
            </div>
          </div>
          <div className="dx-fieldset">
            <div className="dx-fieldset-header">EditBox</div>
            <div className="dx-field">
              <div className="dx-field-label">Product</div>
              <div className="dx-field-value">
                <SelectBox dataSource={productsDataSource}
                  displayExpr="Name"
                  acceptCustomValue={true}
                  defaultValue={this.state.editBoxValue}
                  onCustomItemCreating={this.customItemCreating}
                  onValueChanged={this.editBoxValueChanged} />
              </div>
            </div>
            <div className="dx-field current-product">
              Current product: <span className="current-value">
                {this.state.editBoxValue ?
                  `${this.state.editBoxValue.Name} (ID: ${this.state.editBoxValue.ID})` :
                  'Not selected'}
              </span>
            </div>
          </div>
        </div>

        <div className="options">
          <div className="caption">SearchBox Options</div>
          <div className="option">
            <div>Search Mode</div>
            <SelectBox items={['contains', 'startswith']}
              defaultValue={this.state.searchModeOption}
              onValueChanged={this.searchModeOptionChanged} />
          </div>
          <div className="option">
            <div>Search Expression</div>
            <SelectBox items={searchExprItems}
              displayExpr="name"
              valueExpr="value"
              defaultValue={this.state.searchExprOption}
              onValueChanged={this.searchExprOptionChanged} />
          </div>
          <div className="option">
            <div>Search Timeout</div>
            <NumberBox min={0}
              max={5000}
              showSpinButtons={true}
              step={100}
              defaultValue={this.state.searchTimeoutOption}
              onValueChanged={this.searchTimeoutOptionChanged} />
          </div>
          <div className="option">
            <div>Minimum Search Length</div>
            <NumberBox min={0}
              max={5}
              showSpinButtons={true}
              defaultValue={this.state.minSearchLengthOption}
              onValueChanged={this.minSearchLengthOptionChanged} />
          </div>
          <div className="option">
            <CheckBox text="Show Data Before Search"
              defaultValue={this.state.showDataBeforeSearchOption}
              onValueChanged={this.showDataBeforeSearchOptionChanged} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

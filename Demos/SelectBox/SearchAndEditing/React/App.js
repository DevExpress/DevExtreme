import React from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import { NumberBox } from 'devextreme-react/number-box';
import { CheckBox } from 'devextreme-react/check-box';
import DataSource from 'devextreme/data/data_source';

import { simpleProducts, products } from './data.js';

const searchModeItems = ['contains', 'startswith'];
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
    this.editBoxValueChanged = ({ component }) => {
      this.setState({ editBoxValue: component.option('selectedItem') });
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
    if (!args.text) {
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

    args.customItem = productsDataSource.store().insert(newItem)
      .then(() => productsDataSource.load())
      .then(() => {
        return newItem;
      })
      .catch((error) => {
        throw error;
      });
  }

  render() {
    let { editBoxValue, searchModeOption, searchExprOption, minSearchLengthOption, showDataBeforeSearchOption, searchTimeoutOption } = this.state;
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
                  searchMode={searchModeOption}
                  searchExpr={searchExprOption}
                  searchTimeout={searchTimeoutOption}
                  minSearchLength={minSearchLengthOption}
                  showDataBeforeSearch={showDataBeforeSearchOption} />
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
                  valueExpr="ID"
                  acceptCustomValue={true}
                  defaultValue={simpleProducts[0].ID}
                  onCustomItemCreating={this.customItemCreating}
                  onValueChanged={this.editBoxValueChanged} />
              </div>
            </div>
            <div className="dx-field current-product">
              Current product: <span className="current-value">
                {editBoxValue ?
                  `${editBoxValue.Name} (ID: ${editBoxValue.ID})` :
                  'Not selected'}
              </span>
            </div>
          </div>
        </div>

        <div className="options">
          <div className="caption">SearchBox Options</div>
          <div className="option">
            <div>Search Mode</div>
            <SelectBox items={searchModeItems}
              value={searchModeOption}
              onValueChanged={this.searchModeOptionChanged} />
          </div>
          <div className="option">
            <div>Search Expression</div>
            <SelectBox items={searchExprItems}
              displayExpr="name"
              valueExpr="value"
              value={searchExprOption}
              onValueChanged={this.searchExprOptionChanged} />
          </div>
          <div className="option">
            <div>Search Timeout</div>
            <NumberBox min={0}
              max={5000}
              showSpinButtons={true}
              step={100}
              value={searchTimeoutOption}
              onValueChanged={this.searchTimeoutOptionChanged} />
          </div>
          <div className="option">
            <div>Minimum Search Length</div>
            <NumberBox min={0}
              max={5}
              showSpinButtons={true}
              value={minSearchLengthOption}
              onValueChanged={this.minSearchLengthOptionChanged} />
          </div>
          <div className="option">
            <CheckBox text="Show Data Before Search"
              value={showDataBeforeSearchOption}
              onValueChanged={this.showDataBeforeSearchOptionChanged} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import React from 'react';
import { SelectBox, SelectBoxTypes } from 'devextreme-react/select-box';
import { NumberBox } from 'devextreme-react/number-box';
import { CheckBox } from 'devextreme-react/check-box';
import DataSource from 'devextreme/data/data_source';

import { SimplifiedSearchMode } from 'devextreme/common.js';
import {
  simpleProducts,
  products,
  searchTimeoutLabel,
  minimumSearchLengthLabel,
  searchExpressionLabel,
  searchModeLabel,
  productLabel,
  simpleProductLabel,
} from './data.ts';

const searchModeItems = ['contains', 'startswith'];
const searchExprItems = [
  {
    name: "'Name'",
    value: 'Name',
  },
  {
    name: "['Name', 'Category']",
    value: ['Name', 'Category'],
  },
];
const productsDataSource = new DataSource({
  store: {
    data: simpleProducts,
    type: 'array',
    key: 'ID',
  },
});

const customItemCreating = (args: SelectBoxTypes.CustomItemCreatingEvent) => {
  if (!args.text) {
    args.customItem = null;
    return;
  }

  const productIds = simpleProducts.map((item) => item.ID);
  const incrementedId = Math.max.apply(null, productIds) + 1;
  const newItem = {
    Name: args.text,
    ID: incrementedId,
  };

  args.customItem = productsDataSource
    .store()
    .insert(newItem)
    .then(() => productsDataSource.load())
    .then(() => newItem)
    .catch((error) => {
      throw error;
    });
};

function App() {
  const [editBoxValue, setEditBoxValue] = React.useState(simpleProducts[0]);
  const [searchModeOption, setSearchModeOption] = React.useState<SimplifiedSearchMode>('contains');
  const [searchExprOption, setSearchExprOption] = React.useState('Name');
  const [searchTimeoutOption, setSearchTimeoutOption] = React.useState(200);
  const [minSearchLengthOption, setMinSearchLengthOption] = React.useState(0);
  const [showDataBeforeSearchOption, setShowDataBeforeSearchOption] = React.useState(false);

  const editBoxValueChanged = React.useCallback(({ component }) => {
    setEditBoxValue(component.option('selectedItem'));
  }, []);

  const searchModeOptionChanged = React.useCallback(({ value }) => {
    setSearchModeOption(value);
  }, []);

  const searchExprOptionChanged = React.useCallback(({ value }) => {
    setSearchExprOption(value);
  }, []);

  const searchTimeoutOptionChanged = React.useCallback(({ value }) => {
    setSearchTimeoutOption(value);
  }, []);

  const minSearchLengthOptionChanged = React.useCallback(({ value }) => {
    setMinSearchLengthOption(value);
  }, []);

  const showDataBeforeSearchOptionChanged = React.useCallback(({ value }) => {
    setShowDataBeforeSearchOption(value);
  }, []);

  return (
    <div id="selectbox-demo">
      <div className="widget-container">
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">SearchBox</div>
          <div className="dx-field">
            <div className="dx-field-label">Product</div>
            <div className="dx-field-value">
              <SelectBox
                dataSource={products}
                displayExpr="Name"
                searchEnabled={true}
                inputAttr={simpleProductLabel}
                searchMode={searchModeOption}
                searchExpr={searchExprOption}
                searchTimeout={searchTimeoutOption}
                minSearchLength={minSearchLengthOption}
                showDataBeforeSearch={showDataBeforeSearchOption}
              />
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">EditBox</div>
          <div className="dx-field">
            <div className="dx-field-label">Product</div>
            <div className="dx-field-value">
              <SelectBox
                dataSource={productsDataSource}
                displayExpr="Name"
                valueExpr="ID"
                inputAttr={productLabel}
                acceptCustomValue={true}
                defaultValue={simpleProducts[0].ID}
                onCustomItemCreating={customItemCreating}
                onValueChanged={editBoxValueChanged}
              />
            </div>
          </div>
          <div className="dx-field current-product">
            Current product:{' '}
            <span className="current-value">
              {editBoxValue ? `${editBoxValue.Name} (ID: ${editBoxValue.ID})` : 'Not selected'}
            </span>
          </div>
        </div>
      </div>
      <div className="options">
        <div className="caption">SearchBox Options</div>
        <div className="option">
          <div>Search Mode</div>
          <SelectBox
            items={searchModeItems}
            value={searchModeOption}
            inputAttr={searchModeLabel}
            onValueChanged={searchModeOptionChanged}
          />
        </div>
        <div className="option">
          <div>Search Expression</div>
          <SelectBox
            items={searchExprItems}
            displayExpr="name"
            valueExpr="value"
            inputAttr={searchExpressionLabel}
            value={searchExprOption}
            onValueChanged={searchExprOptionChanged}
          />
        </div>
        <div className="option">
          <div>Search Timeout</div>
          <NumberBox
            min={0}
            max={5000}
            showSpinButtons={true}
            step={100}
            value={searchTimeoutOption}
            inputAttr={searchTimeoutLabel}
            onValueChanged={searchTimeoutOptionChanged}
          />
        </div>
        <div className="option">
          <div>Minimum Search Length</div>
          <NumberBox
            min={0}
            max={5}
            showSpinButtons={true}
            value={minSearchLengthOption}
            inputAttr={minimumSearchLengthLabel}
            onValueChanged={minSearchLengthOptionChanged}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Show Data Before Search"
            value={showDataBeforeSearchOption}
            onValueChanged={showDataBeforeSearchOptionChanged}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

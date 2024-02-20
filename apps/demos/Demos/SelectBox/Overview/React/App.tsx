import React, { useCallback, useState } from 'react';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import ArrayStore from 'devextreme/data/array_store';
import notify from 'devextreme/ui/notify';

import service from './data.ts';
import Field from './Field.tsx';
import Item from './Item.tsx';

const simpleProductLabel = { 'aria-label': 'Simple Product' };
const productIDLabel = { 'aria-label': 'Product ID' };
const productWithPlaceholderLabel = { 'aria-label': 'Product With Placeholder' };
const productLabel = { 'aria-label': 'Product' };
const readOnlyProductLabel = { 'aria-label': 'ReadOnly Product' };
const templatedProductLabel = { 'aria-label': 'Templated Product' };
const disabledProductLabel = { 'aria-label': 'Disabled Product' };

const products = service.getProducts();
const simpleProducts = service.getSimpleProducts();
const data = new ArrayStore({
  data: products,
  key: 'ID',
});

function App() {
  const [value, setValue] = useState(service.getSimpleProducts()[0]);

  const onValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setValue(e.value);
    notify(`The value is changed to: "${e.value}"`);
  }, []);

  return (
    <div>
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Default mode</div>
          <div className="dx-field-value">
            <SelectBox
              items={simpleProducts}
              inputAttr={simpleProductLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">With a custom placeholder</div>
          <div className="dx-field-value">
            <SelectBox
              items={simpleProducts}
              placeholder="Choose Product"
              inputAttr={productWithPlaceholderLabel}
              showClearButton={true}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Read only</div>
          <div className="dx-field-value">
            <SelectBox
              items={simpleProducts}
              defaultValue={simpleProducts[0]}
              inputAttr={readOnlyProductLabel}
              readOnly={true}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Disabled</div>
          <div className="dx-field-value">
            <SelectBox
              items={simpleProducts}
              inputAttr={disabledProductLabel}
              defaultValue={simpleProducts[0]}
              disabled={true}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Data source usage</div>
          <div className="dx-field-value">
            <SelectBox
              dataSource={data}
              displayExpr="Name"
              inputAttr={productIDLabel}
              valueExpr="ID"
              defaultValue={products[0].ID}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Custom templates</div>
          <div className="dx-field-value">
            <SelectBox
              id="custom-templates"
              dataSource={products}
              displayExpr="Name"
              inputAttr={templatedProductLabel}
              valueExpr="ID"
              defaultValue={products[3].ID}
              fieldRender={Field}
              itemRender={Item}
            />
          </div>
        </div>
      </div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Event Handling</div>
        <div className="dx-field">
          <div className="dx-field-label">Product</div>
          <div className="dx-field-value">
            <SelectBox
              items={simpleProducts}
              value={value}
              inputAttr={productLabel}
              onValueChanged={onValueChanged}
            />
          </div>
        </div>
        <div className="current-value">
          Selected product is <span>{value}</span>
        </div>
      </div>
    </div>
  );
}

export default App;

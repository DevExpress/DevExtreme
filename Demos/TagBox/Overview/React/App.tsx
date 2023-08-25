import React from 'react';

import TagBox, { TagBoxTypes } from 'devextreme-react/tag-box';
import Popover from 'devextreme-react/popover';
import ArrayStore from 'devextreme/data/array_store';

import Item from './Item.tsx';
import Tag from './Tag.tsx';
import {
  simpleProducts, products, productLabel, Product,
} from './data.ts';

const disabledValue = [simpleProducts[0]];
const value = [1, 2];
const dataSource = new ArrayStore({
  data: products,
  key: 'Id',
});

function App() {
  const [editableProducts, setEditableProducts] = React.useState([...simpleProducts]);
  const [target, setTarget] = React.useState(null);
  const [product, setProduct] = React.useState<Product>({});

  const onCustomItemCreating = React.useCallback(
    (args: TagBoxTypes.CustomItemCreatingEvent) => {
      const newValue = args.text;
      const isItemInDataSource = editableProducts.some((item) => item === newValue);
      if (!isItemInDataSource) {
        setEditableProducts([newValue, ...editableProducts]);
      }
      args.customItem = newValue;
    },
    [editableProducts],
  );

  const onMouseEnter = React.useCallback((e: { currentTarget: any }, newProduct) => {
    setTarget(e.currentTarget);
    setProduct(newProduct);
  }, []);

  return (
    <React.Fragment>
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Default mode</div>
          <div className="dx-field-value">
            <TagBox
              items={simpleProducts}
              inputAttr={productLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Search mode</div>
          <div className="dx-field-value">
            <TagBox
              items={simpleProducts}
              searchEnabled={true}
              inputAttr={productLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Batch selection</div>
          <div className="dx-field-value">
            <TagBox
              items={simpleProducts}
              showSelectionControls={true}
              inputAttr={productLabel}
              applyValueMode="useButtons"
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Hide selected items</div>
          <div className="dx-field-value">
            <TagBox
              items={simpleProducts}
              inputAttr={productLabel}
              hideSelectedItems={true}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Single line mode</div>
          <div className="dx-field-value">
            <TagBox
              items={simpleProducts}
              inputAttr={productLabel}
              multiline={false}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Add custom items</div>
          <div className="dx-field-value">
            <TagBox
              items={editableProducts}
              inputAttr={productLabel}
              acceptCustomValue={true}
              onCustomItemCreating={onCustomItemCreating}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">With custom placeholder</div>
          <div className="dx-field-value">
            <TagBox
              items={simpleProducts}
              inputAttr={productLabel}
              placeholder="Choose Product..."
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Disabled</div>
          <div className="dx-field-value">
            <TagBox
              items={simpleProducts}
              inputAttr={productLabel}
              value={disabledValue}
              disabled={true}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Data source</div>
          <div className="dx-field-value">
            <TagBox
              dataSource={dataSource}
              inputAttr={productLabel}
              displayExpr="Name"
              valueExpr="Id"
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Custom template</div>
          <div className="dx-field-value">
            <TagBox
              dataSource={dataSource}
              defaultValue={value}
              inputAttr={productLabel}
              displayExpr="Name"
              valueExpr="Id"
              itemRender={Item}
              tagRender={(data) => (
                <Tag
                  product={data}
                  onMouseEnter={onMouseEnter}
                />
              )}
            />

            <Popover
              showEvent="mouseenter"
              hideEvent="mouseleave"
              target={target}
            >
              <p>
                <b>Name: </b>
                <span>{product.Name}</span>
              </p>
              <p>
                <b>Price: </b>
                <span>{product.Price}</span>
              </p>
              <p>
                <b>In-stock: </b>
                <span>{product.Current_Inventory}</span>
              </p>
              <p>
                <b>Category: </b>
                <span>{product.Category}</span>
              </p>
            </Popover>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;

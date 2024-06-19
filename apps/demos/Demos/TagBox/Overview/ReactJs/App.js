import React, { useCallback, useState } from 'react';
import TagBox from 'devextreme-react/tag-box';
import Popover from 'devextreme-react/popover';
import ArrayStore from 'devextreme/data/array_store';
import Item from './Item.js';
import Tag from './Tag.js';
import { simpleProducts, products, productLabel } from './data.js';

const disabledValue = [simpleProducts[0]];
const value = [1, 2];
const dataSource = new ArrayStore({
  data: products,
  key: 'Id',
});
function App() {
  const [editableProducts, setEditableProducts] = useState([...simpleProducts]);
  const [target, setTarget] = useState(null);
  const [product, setProduct] = useState({});
  const onCustomItemCreating = useCallback(
    (args) => {
      const newValue = args.text;
      const isItemInDataSource = editableProducts.some((item) => item === newValue);
      if (!isItemInDataSource) {
        setEditableProducts([newValue, ...editableProducts]);
      }
      args.customItem = newValue;
    },
    [editableProducts],
  );
  const onMouseEnter = useCallback((e, newProduct) => {
    setTarget(e.currentTarget);
    setProduct(newProduct);
  }, []);
  const getAltText = useCallback((text) => `${text}. Picture`, []);
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
              itemRender={(data) => (
                <Item
                  data={data}
                  getAltText={getAltText}
                />
              )}
              tagRender={(data) => (
                <Tag
                  product={data}
                  onMouseEnter={onMouseEnter}
                  getAltText={getAltText}
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

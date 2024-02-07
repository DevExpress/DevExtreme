import React from 'react';
import { TagBox } from 'devextreme-react/tag-box';
import { products, productLabel } from './data.js';

const defaultValues = {
  severalItems: [1, 2, 3, 4],
  allItems: [1, 2, 3, 4, 5],
  ordinaryTags: [1, 2, 3, 4, 5, 6, 7],
};
const items = products.slice(0, 5);
const onMultiTagPreparing = (args) => {
  const selectedItemsLength = args.selectedItems.length;
  const totalCount = 5;
  if (selectedItemsLength < totalCount) {
    args.cancel = true;
  } else {
    args.text = `All selected (${selectedItemsLength})`;
  }
};
function App() {
  return (
    <div>
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Multi-tag for several items</div>
          <div className="dx-field-value">
            <TagBox
              items={products}
              defaultValue={defaultValues.severalItems}
              showSelectionControls={true}
              maxDisplayedTags={3}
              inputAttr={productLabel}
              displayExpr="Name"
              valueExpr="ID"
              selectAllMode="allPages"
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Multi-tag for all items</div>
          <div className="dx-field-value">
            <TagBox
              items={items}
              defaultValue={defaultValues.allItems}
              inputAttr={productLabel}
              showSelectionControls={true}
              maxDisplayedTags={3}
              displayExpr="Name"
              valueExpr="ID"
              onMultiTagPreparing={onMultiTagPreparing}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Multi-tag with ordinary tags</div>
          <div className="dx-field-value">
            <TagBox
              items={products}
              defaultValue={defaultValues.ordinaryTags}
              showSelectionControls={true}
              maxDisplayedTags={2}
              inputAttr={productLabel}
              showMultiTagOnly={false}
              displayExpr="Name"
              valueExpr="ID"
              selectAllMode="allPages"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;

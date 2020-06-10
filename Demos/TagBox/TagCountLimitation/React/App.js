import React from 'react';
import { TagBox } from 'devextreme-react/tag-box';
import { products } from './data.js';

class App extends React.Component {
  constructor() {
    super();
    this.items = products.slice(0, 5);
    this.onMultiTagPreparing = this.onMultiTagPreparing.bind(this);
  }

  onMultiTagPreparing(args) {
    const selectedItemsLength = args.selectedItems.length;
    const totalCount = 5;

    if(selectedItemsLength < totalCount) {
      args.cancel = true;
    } else {
      args.text = `All selected (${ selectedItemsLength })`;
    }
  }

  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Multi-tag for several items</div>
            <div className="dx-field-value">
              <TagBox
                items={products}
                defaultValue={[1, 2, 3, 4]}
                showSelectionControls={true}
                maxDisplayedTags={3}
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
                items={this.items}
                defaultValue={[1, 2, 3, 4, 5]}
                showSelectionControls={true}
                maxDisplayedTags={3}
                displayExpr="Name"
                valueExpr="ID"
                onMultiTagPreparing={this.onMultiTagPreparing} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Multi-tag with ordinary tags</div>
            <div className="dx-field-value">
              <TagBox
                items={products}
                defaultValue={[1, 2, 3, 4, 5, 6, 7]}
                showSelectionControls={true}
                maxDisplayedTags={2}
                showMultiTagOnly={false}
                displayExpr="Name"
                valueExpr="ID"
                selectAllMode="allPages" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

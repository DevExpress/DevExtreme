import React from 'react';
import { TagBox } from 'devextreme-react/tag-box';
import DataSource from 'devextreme/data/data_source';
import Group from './Group.js';

import productsData from './data.js';

const defaultValues = {
  grouped: [17, 19],
  search: [17, 19],
  template: [18],
};

const productLabel = { 'aria-label': 'Product' };

class App extends React.Component {
  constructor() {
    super();

    this.products = new DataSource({
      store: productsData,
      key: 'ID',
      group: 'Category',
    });
  }

  render() {
    return (
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Grouped items</div>
          <div className="dx-field-value">
            <TagBox
              dataSource={this.products}
              inputAttr={productLabel}
              valueExpr="ID"
              defaultValue={defaultValues.grouped}
              grouped={true}
              displayExpr="Name" />
          </div>
        </div>

        <div className="dx-field">
          <div className="dx-field-label">Grouped items with search enabled</div>
          <div className="dx-field-value">
            <TagBox
              dataSource={this.products}
              valueExpr="ID"
              inputAttr={productLabel}
              defaultValue={defaultValues.search}
              searchEnabled={true}
              grouped={true}
              displayExpr="Name" />
          </div>
        </div>

        <div className="dx-field">
          <div className="dx-field-label">Grouped items with a custom group template</div>
          <div className="dx-field-value">
            <TagBox
              dataSource={this.products}
              valueExpr="ID"
              inputAttr={productLabel}
              defaultValue={defaultValues.template}
              grouped={true}
              displayExpr="Name"
              groupRender={Group} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

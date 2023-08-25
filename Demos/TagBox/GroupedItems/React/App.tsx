import React from 'react';
import { TagBox } from 'devextreme-react/tag-box';
import DataSource from 'devextreme/data/data_source';
import Group from './Group.tsx';

import productsData from './data.ts';

const defaultValues = {
  grouped: [17, 19],
  search: [17, 19],
  template: [18],
};

const productLabel = { 'aria-label': 'Product' };

function App() {
  const [products] = React.useState(
    new DataSource({
      store: productsData,
      key: 'ID',
      group: 'Category',
    }),
  );

  return (
    <div className="dx-fieldset">
      <div className="dx-field">
        <div className="dx-field-label">Grouped items</div>
        <div className="dx-field-value">
          <TagBox
            dataSource={products}
            inputAttr={productLabel}
            valueExpr="ID"
            defaultValue={defaultValues.grouped}
            grouped={true}
            displayExpr="Name"
          />
        </div>
      </div>

      <div className="dx-field">
        <div className="dx-field-label">Grouped items with search enabled</div>
        <div className="dx-field-value">
          <TagBox
            dataSource={products}
            valueExpr="ID"
            inputAttr={productLabel}
            defaultValue={defaultValues.search}
            searchEnabled={true}
            grouped={true}
            displayExpr="Name"
          />
        </div>
      </div>

      <div className="dx-field">
        <div className="dx-field-label">Grouped items with a custom group template</div>
        <div className="dx-field-value">
          <TagBox
            dataSource={products}
            valueExpr="ID"
            inputAttr={productLabel}
            defaultValue={defaultValues.template}
            grouped={true}
            displayExpr="Name"
            groupRender={Group}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

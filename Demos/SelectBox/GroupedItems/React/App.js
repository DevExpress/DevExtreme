import React from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import DataSource from 'devextreme/data/data_source';
import Group from './Group.js';

import {
  ungroupedData, pregroupedData, ungroupedDataLabel,
  pregroupedDataLabel, templatedUngroupedDataLabel,
} from './data.js';

const fromUngroupedData = new DataSource({
  store: {
    type: 'array',
    data: ungroupedData,
    key: 'ID',
  },
  group: 'Category',
});
const fromPregroupedData = new DataSource({
  store: {
    type: 'array',
    data: pregroupedData,
    key: 'ID',
  },
  map(item) {
    item.key = item.Category;
    item.items = item.Products;
    return item;
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    fromPregroupedData.load();
  }

  render() {
    return (
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Data grouped in the DataSource</div>
          <div className="dx-field-value">
            <SelectBox
              dataSource={fromUngroupedData}
              valueExpr="ID"
              grouped={true}
              inputAttr={ungroupedDataLabel}
              displayExpr="Name"
              defaultValue={1} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Pre-grouped data</div>
          <div className="dx-field-value">
            <SelectBox
              dataSource={fromPregroupedData}
              valueExpr="ID"
              inputAttr={pregroupedDataLabel}
              grouped={true}
              displayExpr="Name"
              defaultValue={1} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Custom group template</div>
          <div className="dx-field-value">
            <SelectBox
              dataSource={fromUngroupedData}
              valueExpr="ID"
              inputAttr={templatedUngroupedDataLabel}
              grouped={true}
              displayExpr="Name"
              groupRender={Group}
              defaultValue={1} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

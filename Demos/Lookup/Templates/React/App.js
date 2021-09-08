import React from 'react';
import { Lookup, DropDownOptions } from 'devextreme-react/lookup';

import { employees } from './data.js';
import Field from './Field.js';
import Item from './Item.js';

const searchExpression = ['FirstName', 'LastName', 'Prefix'];

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Custom Field Template</div>
          <div className="dx-field">
            <Lookup className="field-customization"
              defaultValue={employees[0].ID}
              displayExpr={this.getDisplayExpr}
              valueExpr="ID"
              items={employees}
              searchEnabled={true}
              fieldRender={Field}>
              <DropDownOptions title="Select employee" />
            </Lookup>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Custom Item Template</div>
          <div className="dx-field">
            <Lookup
              items={employees}
              displayExpr={this.getDisplayExpr}
              searchExpr={searchExpression}
              valueExpr="ID"
              placeholder="Select employee"
              itemRender={Item}>
              <DropDownOptions title="Select employee" />
            </Lookup>
          </div>
        </div>
      </div>
    );
  }

  getDisplayExpr(item) {
    return item ? `${item.FirstName} ${item.LastName}` : '';
  }
}

export default App;

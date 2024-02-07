import React from 'react';
import { Lookup, DropDownOptions } from 'devextreme-react/lookup';
import { employees } from './data.js';
import Field from './Field.js';
import Item from './Item.js';

const searchExpression = ['FirstName', 'LastName', 'Prefix'];
const customFieldLabel = { 'aria-label': 'Custom Field Template' };
const customItemLabel = { 'aria-label': 'Custom Item Template' };
const getDisplayExpr = (item) => (item ? `${item.FirstName} ${item.LastName}` : '');
export default function App() {
  return (
    <div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Custom Field Template</div>
        <div className="dx-field">
          <Lookup
            className="field-customization"
            defaultValue={employees[0].ID}
            displayExpr={getDisplayExpr}
            valueExpr="ID"
            items={employees}
            searchEnabled={true}
            fieldRender={Field}
            inputAttr={customFieldLabel}
          >
            <DropDownOptions title="Select employee" />
          </Lookup>
        </div>
      </div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Custom Item Template</div>
        <div className="dx-field">
          <Lookup
            items={employees}
            displayExpr={getDisplayExpr}
            searchExpr={searchExpression}
            valueExpr="ID"
            placeholder="Select employee"
            itemRender={Item}
            inputAttr={customItemLabel}
          >
            <DropDownOptions title="Select employee" />
          </Lookup>
        </div>
      </div>
    </div>
  );
}

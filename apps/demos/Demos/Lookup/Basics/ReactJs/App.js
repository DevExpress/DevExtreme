import React from 'react';
import { Lookup, DropDownOptions } from 'devextreme-react/lookup';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { employeesList, employeesTasks } from './data.js';

const simpleLookupLabel = { 'aria-label': 'Simple lookup' };
const groupedLookupLabel = { 'aria-label': 'Grouped lookup' };
const groupedData = new DataSource({
  store: new ArrayStore({
    data: employeesTasks,
    key: 'ID',
  }),
  group: 'Assigned',
});
const App = () => (
  <div>
    <div className="dx-fieldset">
      <div className="dx-fieldset-header">Simple lookup</div>
      <div className="dx-field">
        <Lookup
          items={employeesList}
          defaultValue={employeesList[0]}
          inputAttr={simpleLookupLabel}
        >
          <DropDownOptions showTitle={false} />
        </Lookup>
      </div>
    </div>
    <div className="dx-fieldset">
      <div className="dx-fieldset-header">Grouped lookup</div>
      <div className="dx-field">
        <Lookup
          dataSource={groupedData}
          grouped={true}
          displayExpr="Subject"
          inputAttr={groupedLookupLabel}
        >
          <DropDownOptions
            hideOnOutsideClick={true}
            showTitle={false}
          />
        </Lookup>
      </div>
    </div>
  </div>
);
export default App;

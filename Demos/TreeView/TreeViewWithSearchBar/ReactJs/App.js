import React from 'react';
import TreeView from 'devextreme-react/tree-view';
import SelectBox from 'devextreme-react/select-box';
import { products, searchModeLabel } from './data.js';

const options = ['contains', 'startswith', 'equals'];
const App = () => {
  const [value, setValue] = React.useState('contains');
  const valueChanged = React.useCallback(
    (e) => {
      setValue(e.value);
    },
    [setValue],
  );
  return (
    <React.Fragment>
      <TreeView
        id="treeview"
        items={products}
        width={500}
        searchMode={value}
        searchEnabled={true}
      />
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Search mode</span>
          <SelectBox
            items={options}
            inputAttr={searchModeLabel}
            value={value}
            onValueChanged={valueChanged}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
export default App;

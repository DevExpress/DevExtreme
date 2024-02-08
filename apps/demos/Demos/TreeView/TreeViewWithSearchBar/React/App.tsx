import React, { useCallback, useState } from 'react';

import TreeView from 'devextreme-react/tree-view';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import { SearchMode } from 'devextreme/common';

import { products, searchModeLabel } from './data.ts';

const options: SearchMode[] = ['contains', 'startswith', 'equals'];

const App = () => {
  const [value, setValue] = useState<SearchMode>('contains');

  const valueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setValue(e.value);
  }, [setValue]);

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

import React, { useCallback, useState } from 'react';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import List, { ListTypes } from 'devextreme-react/list';
import { products, searchModeLabel } from './data.ts';

function ItemTemplate(data) {
  return <div>{data.Name}</div>;
}

const searchModes = ['contains', 'startsWith', 'equals'];

const App = () => {
  const [searchMode, setSearchMode] = useState<ListTypes.Properties['searchMode']>('contains');

  const onSearchModeChange = useCallback((args: SelectBoxTypes.ValueChangedEvent) => {
    setSearchMode(args.value);
  }, [setSearchMode]);

  return (
    <React.Fragment>
      <div className="list-container">
        <List
          dataSource={products}
          height={400}
          itemRender={ItemTemplate}
          searchExpr="Name"
          searchEnabled={true}
          searchMode={searchMode} />
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Search mode </span>
          <SelectBox
            items={searchModes}
            inputAttr={searchModeLabel}
            value={searchMode}
            onValueChanged={onSearchModeChange} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;

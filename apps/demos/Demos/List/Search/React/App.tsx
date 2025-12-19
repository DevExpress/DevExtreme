import React, { useCallback, useState } from 'react';
import SelectBox from 'devextreme-react/select-box';
import type { SelectBoxTypes } from 'devextreme-react/select-box';
import List from 'devextreme-react/list';
import type { SearchMode } from 'devextreme-react/common';
import { products, searchModeLabel } from './data.ts';
import type { Product } from './types.ts';

function ItemTemplate(data: Product) {
  return <div>{data.Name}</div>;
}

const searchModes: SearchMode[] = ['contains', 'startswith', 'equals'];

const App = () => {
  const [searchMode, setSearchMode] = useState<SearchMode>('contains');

  const onSearchModeChange = useCallback((args: SelectBoxTypes.ValueChangedEvent): void => {
    setSearchMode(args.value);
  }, []);

  return (
    <>
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
    </>
  );
};

export default App;

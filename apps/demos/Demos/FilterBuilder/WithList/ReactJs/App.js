import React, { useCallback, useRef, useState } from 'react';
import FilterBuilder from 'devextreme-react/filter-builder';
import Button from 'devextreme-react/button';
import List from 'devextreme-react/list';
import DataSource from 'devextreme/data/data_source';
import { filter, fields, products } from './data.js';
import CustomItem from './CustomItem.js';

const App = () => {
  const dataSource = useRef(
    new DataSource({
      store: products,
    }),
  );
  const filterBuilderInstance = useRef(null);
  const [value, setValue] = useState(filter);
  const setFilterBuilderInstance = (ref) => {
    filterBuilderInstance.current = ref.instance;
    refreshDataSource();
  };
  const onValueChanged = useCallback(
    (e) => {
      setValue(e.value);
    },
    [setValue],
  );
  const refreshDataSource = useCallback(() => {
    dataSource.current.filter(filterBuilderInstance.current.getFilterExpression());
    dataSource.current.load();
  }, []);
  return (
    <div>
      <div className="filter-container">
        <FilterBuilder
          ref={setFilterBuilderInstance}
          fields={fields}
          value={value}
          onValueChanged={onValueChanged}
        />
        <Button
          text="Apply Filter"
          type="default"
          onClick={refreshDataSource}
        />
        <div className="dx-clearfix"></div>
      </div>
      <div className="list-container">
        <List
          dataSource={dataSource.current}
          itemRender={CustomItem}
        />
      </div>
    </div>
  );
};
export default App;

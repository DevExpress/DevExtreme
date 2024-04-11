import React, { useCallback, useRef } from 'react';
import FilterBuilder from 'devextreme-react/filter-builder';
import Button from 'devextreme-react/button';
import List from 'devextreme-react/list';
import DataSource from 'devextreme/data/data_source';
import { filter, fields, products } from './data.ts';
import CustomItem from './CustomItem.tsx';

const App = () => {
  const dataSource = useRef(new DataSource({
    store: products,
  }));
  const filterBuilderRef = useRef(null);

  const refreshDataSource = useCallback(() => {
    const filterExpression = filterBuilderRef.current.instance().getFilterExpression();
    dataSource.current.filter(filterExpression);
    dataSource.current.load();
  }, []);

  return (
    <div>
      <div className="filter-container">
        <FilterBuilder ref={filterBuilderRef}
          fields={fields}
          defaultValue={filter} />
        <Button
          text="Apply Filter"
          type="default"
          onClick={refreshDataSource} />
        <div className="dx-clearfix"></div>
      </div>
      <div className="list-container">
        <List dataSource={dataSource.current} itemRender={CustomItem} />
      </div>
    </div>
  );
};

export default App;
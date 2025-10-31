import React, { useCallback, useState } from 'react';
import FilterBuilder from 'devextreme-react/filter-builder';
import Button from 'devextreme-react/button';
import DataGrid from 'devextreme-react/data-grid';
import { filter, fields, columns, products } from './data.js';

const App = () => {
  const [value, setValue] = useState(filter);
  const [gridFilterValue, setGridFilterValue] = useState(filter);
  const onValueChanged = useCallback(
    (e) => {
      setValue(e.value);
    },
    [setValue],
  );
  const buttonClick = useCallback(() => {
    setGridFilterValue(value);
  }, [value, setGridFilterValue]);
  return (
    <div>
      <div className="filter-container">
        <FilterBuilder
          fields={fields}
          value={value}
          onValueChanged={onValueChanged}
        />
        <Button
          text="Apply Filter"
          type="default"
          onClick={buttonClick}
        />
        <div className="dx-clearfix"></div>
      </div>
      <DataGrid
        dataSource={products}
        filterValue={gridFilterValue}
        showBorders={true}
        columns={columns}
        height={300}
      />
    </div>
  );
};
export default App;

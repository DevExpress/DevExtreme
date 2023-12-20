import React, { useCallback, useRef, useState } from 'react';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import DataGrid, {
  Grouping,
  Column,
  ColumnChooser,
  LoadPanel,
  Toolbar,
  Item,
} from 'devextreme-react/data-grid';
import query from 'devextreme/data/query';
import { orders } from './data.js';

const countLabel = { 'aria-label': 'Count' };
const groupingValues = [
  {
    value: 'CustomerStoreState',
    text: 'Grouping by State',
  },
  {
    value: 'Employee',
    text: 'Grouping by Employee',
  },
];
const getGroupCount = (groupField) => query(orders).groupBy(groupField).toArray().length;
const App = () => {
  const [expandAll, setExpandAll] = useState(true);
  const [totalCount, setTotalCount] = useState(getGroupCount('CustomerStoreState'));
  const [groupColumn, setGroupColumn] = useState('CustomerStoreState');
  const dataGridRef = useRef(null);
  const toggleGroupColumn = useCallback((e) => {
    const newGrouping = e.value;
    dataGridRef.current.instance.clearGrouping();
    dataGridRef.current.instance.columnOption(newGrouping, 'groupIndex', 0);
    setTotalCount(getGroupCount(newGrouping));
    setGroupColumn(newGrouping);
  }, []);
  const toggleExpandAll = useCallback(() => {
    setExpandAll(!expandAll);
  }, [expandAll]);
  const refreshDataGrid = useCallback(() => {
    dataGridRef.current.instance.refresh();
  }, []);
  return (
    <DataGrid
      id="gridContainer"
      ref={dataGridRef}
      dataSource={orders}
      keyExpr="ID"
      showBorders={true}
    >
      <Grouping autoExpandAll={expandAll} />
      <ColumnChooser enabled={true} />
      <LoadPanel enabled={true} />
      <Column
        dataField="OrderNumber"
        caption="Invoice Number"
      />
      <Column dataField="OrderDate" />
      <Column dataField="Employee" />
      <Column
        dataField="CustomerStoreCity"
        caption="City"
      />
      <Column
        dataField="CustomerStoreState"
        caption="State"
        groupIndex={0}
      />
      <Column
        dataField="SaleAmount"
        alignment="right"
        format="currency"
      />
      <Toolbar>
        <Item location="before">
          <div className="informer">
            <div className="count">{totalCount}</div>
            <span>Total Count</span>
          </div>
        </Item>
        <Item location="before">
          <SelectBox
            width="225"
            items={groupingValues}
            displayExpr="text"
            inputAttr={countLabel}
            valueExpr="value"
            value={groupColumn}
            onValueChanged={toggleGroupColumn}
          />
        </Item>
        <Item location="before">
          <Button
            text={expandAll ? 'Collapse All' : 'Expand All'}
            width="136"
            onClick={toggleExpandAll}
          />
        </Item>
        <Item location="after">
          <Button
            icon="refresh"
            onClick={refreshDataGrid}
          />
        </Item>
        <Item name="columnChooserButton" />
      </Toolbar>
    </DataGrid>
  );
};
export default App;

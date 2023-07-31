import React from 'react';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import DataGrid, {
  Grouping, Column, ColumnChooser, LoadPanel, Toolbar, Item,
} from 'devextreme-react/data-grid';

import query from 'devextreme/data/query';
import service from './data.js';

const countLabel = { 'aria-label': 'Count' };
const groupingValues = [{
  value: 'CustomerStoreState',
  text: 'Grouping by State',
}, {
  value: 'Employee',
  text: 'Grouping by Employee',
}];

const orders = service.getOrders();

const getGroupCount = (groupField) => query(orders).groupBy(groupField).toArray().length;

const App = () => {
  const [expanded, setExpanded] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(getGroupCount('CustomerStoreState'));
  const [grouping, setGrouping] = React.useState('CustomerStoreState');
  const dataGridRef = React.useRef(null);

  const groupChanged = React.useCallback((e) => {
    const newGrouping = e.value;
    dataGridRef.current.instance.clearGrouping();
    dataGridRef.current.instance.columnOption(newGrouping, 'groupIndex', 0);
    setTotalCount(getGroupCount(newGrouping));
    setGrouping(newGrouping);
  }, []);

  const collapseAllClick = React.useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const refreshDataGrid = React.useCallback(() => {
    dataGridRef.current.instance.refresh();
  }, []);

  return (
    <DataGrid
      id="gridContainer"
      ref={dataGridRef}
      dataSource={orders}
      keyExpr="ID"
      showBorders={true}>
      <Grouping autoExpandAll={expanded} />
      <ColumnChooser enabled={true} />
      <LoadPanel enabled={true} />
      <Column dataField="OrderNumber" caption="Invoice Number" />
      <Column dataField="OrderDate" />
      <Column dataField="Employee" />
      <Column dataField="CustomerStoreCity" caption="City" />
      <Column dataField="CustomerStoreState" caption="State" groupIndex={0} />
      <Column dataField="SaleAmount" alignment="right" format="currency" />
      <Toolbar>
        <Item location="before">
          <div className="informer">
            <h2 className="count">{totalCount}</h2>
            <span className="name">Total Count</span>
          </div>
        </Item>
        <Item location="before">
          <SelectBox
            width="225"
            items={groupingValues}
            displayExpr="text"
            inputAttr={countLabel}
            valueExpr="value"
            value={grouping}
            onValueChanged={groupChanged} />
        </Item>
        <Item location="before">
          <Button
            text={expanded ? 'Collapse All' : 'Expand All'}
            width='136'
            onClick={collapseAllClick} />
        </Item>
        <Item location="after">
          <Button
            icon='refresh'
            onClick={refreshDataGrid} />
        </Item>
        <Item name="columnChooserButton" />
      </Toolbar>
    </DataGrid>
  );
};

export default App;

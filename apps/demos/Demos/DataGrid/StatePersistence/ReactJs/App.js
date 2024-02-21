import React, { useCallback, useRef } from 'react';
import DataGrid, {
  Selection,
  FilterRow,
  GroupPanel,
  StateStoring,
  Pager,
  Column,
} from 'devextreme-react/data-grid';
import { orders } from './data.js';

const allowedPageSizes = [5, 10, 20];
const onRefreshClick = () => {
  window.location.reload();
};
const App = () => {
  const dataGridRef = useRef(null);
  const onStateResetClick = useCallback(() => {
    dataGridRef.current.instance.state(null);
  }, []);
  return (
    <React.Fragment>
      <div id="descContainer">
        Sort and filter data, group, reorder and resize columns, change page numbers and page size.
        Once you are done, <a onClick={onRefreshClick}>refresh</a> the web page to see that the
        grid’s state is automatically persisted to continue working from where you stopped or you
        can <a onClick={onStateResetClick}>reset</a> the grid to its initial state.
      </div>
      <DataGrid
        id="gridContainer"
        dataSource={orders}
        allowColumnResizing={true}
        allowColumnReordering={true}
        width="100%"
        showBorders={true}
        keyExpr="ID"
        ref={dataGridRef}
      >
        <Selection mode="single" />
        <FilterRow visible={true} />
        <GroupPanel visible={true} />
        <StateStoring
          enabled={true}
          type="localStorage"
          storageKey="storage"
        />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={allowedPageSizes}
        />
        <Column
          dataField="OrderNumber"
          caption="Invoice Number"
          width={130}
        />
        <Column
          dataField="OrderDate"
          sortOrder="desc"
          dataType="date"
        />
        <Column
          dataField="SaleAmount"
          alignment="right"
          format="currency"
        />
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
      </DataGrid>
    </React.Fragment>
  );
};
export default App;

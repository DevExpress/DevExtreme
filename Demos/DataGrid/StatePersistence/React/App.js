import React from 'react';
import DataGrid, { Selection, FilterRow, GroupPanel, StateStoring, Pager, Column } from 'devextreme-react/data-grid';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.orders = service.getOrders();
    this.dataGrid = React.createRef();
    this.onStateResetClick = this.onStateResetClick.bind(this);
  }
  onRefreshClick() {
    window.location.reload();
  }
  onStateResetClick() {
    this.dataGrid.current.instance.state(null);
  }
  render() {
    return (
      <React.Fragment>
        <div id="descContainer">Sort and filter data, group, reorder and resize columns, change page numbers and page size. Once you are done, <a onClick={this.onRefreshClick}>refresh</a> the web page to see that the grid’s state is automatically persisted to continue working from where you stopped or you can <a onClick={this.onStateResetClick}>reset</a> the grid to its initial state.</div>
        <DataGrid
          id="gridContainer"
          dataSource={this.orders}
          allowColumnResizing={true}
          allowColumnReordering={true}
          showBorders={true}
          keyExpr="ID"
          ref={this.dataGrid}>
          <Selection mode="single" />
          <FilterRow visible={true} />
          <GroupPanel visible={true} />
          <StateStoring enabled={true} type="localStorage" storageKey="storage" />
          <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} />
          <Column dataField="OrderNumber" caption="Invoice Number" width={130} />
          <Column dataField="OrderDate" sortOrder="desc" dataType="date" />
          <Column dataField="SaleAmount" alignment="right" format="currency" />
          <Column dataField="Employee" />
          <Column dataField="CustomerStoreCity" caption="City" />
          <Column dataField="CustomerStoreState" caption="State" groupIndex={0} />
        </DataGrid>
      </React.Fragment>
    );
  }
}

export default App;

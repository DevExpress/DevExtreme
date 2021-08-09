import React from 'react';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import DataGrid, { Grouping, Column, ColumnChooser, LoadPanel, Toolbar, Item } from 'devextreme-react/data-grid';

import query from 'devextreme/data/query';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.orders = service.getOrders();
    this.state = {
      expanded: true,
      totalCount: this.getGroupCount('CustomerStoreState'),
      grouping: 'CustomerStoreState'
    };
    this.groupingValues = [{
      value: 'CustomerStoreState',
      text: 'Grouping by State'
    }, {
      value: 'Employee',
      text: 'Grouping by Employee'
    }];
    this.dataGrid = null;

    this.groupChanged = this.groupChanged.bind(this);
    this.collapseAllClick = this.collapseAllClick.bind(this);
    this.refreshDataGrid = this.refreshDataGrid.bind(this);
  }
  getGroupCount(groupField) {
    return query(this.orders)
      .groupBy(groupField)
      .toArray().length;
  }
  groupChanged(e) {
    const grouping = e.value;
    this.dataGrid.instance.clearGrouping();
    this.dataGrid.instance.columnOption(grouping, 'groupIndex', 0);
    this.setState({
      totalCount: this.getGroupCount(grouping),
      grouping
    });
  }
  collapseAllClick(e) {
    let newValue = !this.state.expanded;
    e.component.option('text', newValue ? 'Collapse All' : 'Expand All');
    this.setState({
      expanded: newValue
    });
  }
  refreshDataGrid() {
    this.dataGrid.instance.refresh();
  }
  render() {
    return (
      <DataGrid id="gridContainer"
        ref={(ref) => window.dataGrid = this.dataGrid = ref}
        dataSource={this.orders}
        keyExpr="ID"
        showBorders={true}
        onToolbarPreparing={this.onToolbarPreparing}>
        <Grouping autoExpandAll={this.state.expanded} />
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
              <h2 className="count">{this.state.totalCount}</h2>
              <span className="name">Total Count</span>
            </div>
          </Item>
          <Item location="before">
            <SelectBox
              width="200"
              items={this.groupingValues}
              displayExpr="text"
              valueExpr="value"
              value={this.state.grouping}
              onValueChanged={this.groupChanged} />
          </Item>
          <Item location="before">
            <Button
              text='Collapse All'
              width='136'
              onClick={this.collapseAllClick} />
          </Item>
          <Item location="after">
            <Button
              icon='refresh'
              onClick={this.refreshDataGrid} />
          </Item>
          <Item
            name="columnChooserButton"
          />
        </Toolbar>
      </DataGrid>
    );
  }
}

export default App;

import React from 'react';
import DataGrid, { Column, Export, Summary, GroupPanel, Grouping, SortByGroupSummaryInfo, GroupItem, TotalItem } from 'devextreme-react/data-grid';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.orders = service.getOrders();
  }

  render() {
    return (
      <div>
        <DataGrid
          id="gridContainer"
          dataSource={this.orders}
          keyExpr="ID"
          showBorders={true}
          onCellPrepared={this.onCellPrepared}>

          <GroupPanel visible={true} />
          <Grouping autoExpandAll={true} />
          <SortByGroupSummaryInfo summaryItem="count" />

          <Column dataField="Employee" groupIndex={0} />
          <Column dataField="OrderNumber" caption="Invoice Number" width={130} />
          <Column dataField="OrderDate" dataType="date" width={160} />
          <Column dataField="CustomerStoreCity" caption="City" groupIndex={1} />
          <Column dataField="CustomerStoreState" caption="State" />
          <Column dataField="SaleAmount" alignment="right" format="currency" sortOrder="desc" />

          <Export enabled={true} customizeExcelCell={this.customizeExcelCell} />

          <Summary>
            <GroupItem
              column="OrderNumber"
              summaryType="count"
              displayFormat="{0} orders"
              alignByColumn={false} />
            <GroupItem
              column="SaleAmount"
              summaryType="max"
              displayFormat="Max: {0}"
              valueFormat="currency"
              alignByColumn={true}
              showInGroupFooter={false} />
            <GroupItem
              column="SaleAmount"
              summaryType="sum"
              displayFormat="Sum: {0}"
              valueFormat="currency"
              alignByColumn={true}
              showInGroupFooter={true} />

            <TotalItem
              column="SaleAmount"
              summaryType="sum"
              displayFormat="Total Sum: {0}"
              valueFormat="currency" />
          </Summary>
        </DataGrid>
      </div>
    );
  }

  onCellPrepared(e) {
    if(e.rowType === 'data') {
      if(e.data.OrderDate < new Date(2014, 2, 3)) {
        e.cellElement.style.color = '#AAAAAA';
      }
      if(e.data.SaleAmount > 15000) {
        if(e.column.dataField === 'OrderNumber') {
          e.cellElement.style.fontWeight = 'bold';
        }
        if(e.column.dataField === 'SaleAmount') {
          e.cellElement.style.backgroundColor = '#FFBB00';
          e.cellElement.style.color = '#000000';
        }
      }
    }

    if(e.rowType === 'group') {
      if(e.row.groupIndex === 0) {
        e.cellElement.style.backgroundColor = '#BEDFE6';
      }
      if(e.row.groupIndex === 1) {
        e.cellElement.style.backgroundColor = '#C9ECD7';
      }
      e.cellElement.style.color = '#000';
      if(e.cellElement.firstChild && e.cellElement.firstChild.style) {
        e.cellElement.firstChild.style.color = '#000';
      }
    }

    if(e.rowType === 'groupFooter' && e.column.dataField === 'SaleAmount') {
      e.cellElement.style.fontStyle = 'italic';
    }
  }

  customizeExcelCell(options) {
    var gridCell = options.gridCell;
    if(!gridCell) {
      return;
    }

    if(gridCell.rowType === 'data') {
      if(gridCell.data.OrderDate < new Date(2014, 2, 3)) {
        options.font.color = '#AAAAAA';
      }
      if(gridCell.data.SaleAmount > 15000) {
        if(gridCell.column.dataField === 'OrderNumber') {
          options.font.bold = true;
        }
        if(gridCell.column.dataField === 'SaleAmount') {
          options.backgroundColor = '#FFBB00';
          options.font.color = '#000000';
        }
      }
    }

    if(gridCell.rowType === 'group') {
      if(gridCell.groupIndex === 0) {
        options.backgroundColor = '#BEDFE6';
      }
      if(gridCell.groupIndex === 1) {
        options.backgroundColor = '#C9ECD7';
      }
      if(gridCell.column.dataField === 'Employee') {
        options.value = `${gridCell.value} (${gridCell.groupSummaryItems[0].value} items)`;
        options.font.bold = false;
      }
      if(gridCell.column.dataField === 'SaleAmount') {
        options.value = gridCell.groupSummaryItems[0].value;
        options.numberFormat = '&quot;Max: &quot;$0.00';
      }
    }

    if(gridCell.rowType === 'groupFooter' && gridCell.column.dataField === 'SaleAmount') {
      options.value = gridCell.value;
      options.numberFormat = '&quot;Sum: &quot;$0.00';
      options.font.italic = true;
    }

    if(gridCell.rowType === 'totalFooter' && gridCell.column.dataField === 'SaleAmount') {
      options.value = gridCell.value;
      options.numberFormat = '&quot;Total Sum: &quot;$0.00';
    }
  }
}

export default App;

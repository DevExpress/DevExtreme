import React from 'react';
import DataGrid, { Column, Summary, TotalItem, MasterDetail, Paging } from 'devextreme-react/data-grid';
import { Slider, Tooltip } from 'devextreme-react/slider';
import { productsStore, ordersStore, getOrderCount, addOrder } from './data.js';
import DataSource from 'devextreme/data/data_source';

const dataSource = new DataSource({
  store: productsStore,
  reshapeOnPush: true
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updateFrequency: 100
    };

    this.onUpdateFrequencyChanged = this.onUpdateFrequencyChanged.bind(this);
    this.detailRender = this.detailRender.bind(this);

    setInterval(() => {
      if(getOrderCount() > 500000) {
        return;
      }

      for(var i = 0; i < this.state.updateFrequency / 20; i++) {
        addOrder();
      }
    }, 50);
  }

  render() {
    return (
      <div>
        <DataGrid
          dataSource={dataSource}
          repaintChangesOnly={true}
          columnAutoWidth={true}
          showBorders={true}>
          <Paging pageSize={10} />
          <Column
            dataField="ProductName"
            dataType="string" />
          <Column
            dataField="UnitPrice"
            dataType="number"
            format="currency" />
          <Column
            dataField="OrderCount"
            dataType="number" />
          <Column
            dataField="Quantity"
            dataType="number" />
          <Column
            dataField="Amount"
            dataType="number"
            format="currency" />
          <Summary>
            <TotalItem column="ProductName" summaryType="count" />
            <TotalItem column="Amount" summaryType="sum" displayFormat="{0}" valueFormat="currency" />
            <TotalItem column="OrderCount" summaryType="sum" displayFormat="{0}" />
          </Summary>
          <MasterDetail
            enabled={true}
            render={this.detailRender}>
          </MasterDetail>
        </DataGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Update frequency:</span>
            <Slider
              min={10}
              step={10}
              max={5000}
              value={this.state.updateFrequency}
              onValueChanged={this.onUpdateFrequencyChanged}>
              <Tooltip
                enabled={true}
                format="#0 per second"
                showMode="always"
                position="top">
              </Tooltip>
            </Slider>
          </div>
        </div>
      </div>
    );
  }

  detailRender(detail) {
    return (
      <DataGrid
        dataSource={this.getDetailGridDataSource(detail.data)}
        repaintChangesOnly={true}
        columnAutoWidth={true}
        showBorders={true}>
        <Paging pageSize={5} />
        <Column
          dataField="OrderID"
          dataType="number" />
        <Column
          dataField="ShipCity"
          dataType="string" />
        <Column
          dataField="OrderDate"
          dataType="datetime"
          format="yyyy/MM/dd HH:mm:ss" />
        <Column
          dataField="UnitPrice"
          dataType="number"
          format="currency" />
        <Column
          dataField="Quantity"
          dataType="number" />
        <Column
          caption="Amount"
          dataType="number"
          format="currency"
          allowSorting={true}
          calculateCellValue={this.getAmount} />
        <Summary>
          <TotalItem column="OrderID" summaryType="count" />
          <TotalItem column="Quantity" summaryType="sum" displayFormat="{0}" />
          <TotalItem column="Amount" summaryType="sum" displayFormat="{0}" valueFormat="currency" />
        </Summary>
      </DataGrid>
    );
  }

  onUpdateFrequencyChanged(e) {
    this.setState({
      updateFrequency: e.value
    });
  }

  getDetailGridDataSource(product) {
    return {
      store: ordersStore,
      reshapeOnPush: true,
      filter: ['ProductID', '=', product.ProductID]
    };
  }

  getAmount(order) {
    return order.UnitPrice * order.Quantity;
  }
}

export default App;

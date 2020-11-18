import React from 'react';

import { Column, DataGrid, Paging, Summary, TotalItem, ValueFormat } from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';

class OrderHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orderHistoryStore: null
    };
  }

  render() {
    return (
      <DataGrid
        dataSource={this.state.orderHistoryStore}
        showBorders={true}
      >
        <Paging defaultPageSize={5} />

        <Column dataField="OrderID" />
        <Column dataField="OrderDate" dataType="date" />
        <Column dataField="ShipCountry" />
        <Column dataField="ShipCity" />
        <Column dataField="UnitPrice" format="currency" />
        <Column dataField="Quantity" />
        <Column dataField="Discount" format="percent" />

        <Summary>
          <TotalItem column="UnitPrice" summaryType="sum">
            <ValueFormat format="currency" precision={2} />
          </TotalItem>
          <TotalItem column="Quantity" summaryType="count" />
        </Summary>

      </DataGrid>
    );
  }

  componentDidUpdate(prevProps) {
    const { productId } = this.props;
    if(prevProps.productId !== productId) {
      this.setState({
        orderHistoryStore: createStore({
          key: 'OrderID',
          loadParams: { ProductID: productId },
          loadUrl: `${url}/GetOrdersByProduct`
        })
      });
    }
  }
}

export default OrderHistory;

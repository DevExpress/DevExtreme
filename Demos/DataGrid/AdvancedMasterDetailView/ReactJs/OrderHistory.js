import React, { useEffect, useState } from 'react';
import {
  Column,
  DataGrid,
  Paging,
  Summary,
  TotalItem,
  ValueFormat,
} from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';
const OrderHistory = ({ productId }) => {
  const [orderHistoryStore, setOrderHistoryStore] = useState(null);
  useEffect(() => {
    if (productId) {
      const newOrderHistoryStore = createStore({
        key: 'OrderID',
        loadParams: { ProductID: productId },
        loadUrl: `${url}/GetOrdersByProduct`,
      });
      setOrderHistoryStore(newOrderHistoryStore);
    }
  }, [productId]);
  return (
    <DataGrid
      dataSource={orderHistoryStore}
      showBorders={true}
    >
      <Paging defaultPageSize={5} />

      <Column dataField="OrderID" />
      <Column
        dataField="OrderDate"
        dataType="date"
      />
      <Column dataField="ShipCountry" />
      <Column dataField="ShipCity" />
      <Column
        dataField="UnitPrice"
        format="currency"
      />
      <Column dataField="Quantity" />
      <Column
        dataField="Discount"
        format="percent"
      />

      <Summary>
        <TotalItem
          column="UnitPrice"
          summaryType="sum"
        >
          <ValueFormat precision={2} />
        </TotalItem>
        <TotalItem
          column="Quantity"
          summaryType="count"
        />
      </Summary>
    </DataGrid>
  );
};
export default OrderHistory;

import React from 'react';
import DataGrid, {
  Column,
  Summary,
  TotalItem,
  MasterDetail,
  Paging,
} from 'devextreme-react/data-grid';
import { Slider, Tooltip } from 'devextreme-react/slider';
import DataSource from 'devextreme/data/data_source';
import {
  productsStore, ordersStore, getOrderCount, addOrder,
} from './data.js';

const dataSource = new DataSource({
  store: productsStore,
  reshapeOnPush: true,
});
const getDetailGridDataSource = (product) => ({
  store: ordersStore,
  reshapeOnPush: true,
  filter: ['ProductID', '=', product.ProductID],
});
const getAmount = (order) => order.UnitPrice * order.Quantity;
const detailRender = (detail) => (
  <DataGrid
    dataSource={getDetailGridDataSource(detail.data)}
    repaintChangesOnly={true}
    columnAutoWidth={true}
    showBorders={true}
  >
    <Paging defaultPageSize={5} />
    <Column
      dataField="OrderID"
      dataType="number"
    />
    <Column
      dataField="ShipCity"
      dataType="string"
    />
    <Column
      dataField="OrderDate"
      dataType="datetime"
      format="yyyy/MM/dd HH:mm:ss"
    />
    <Column
      dataField="UnitPrice"
      dataType="number"
      format="currency"
    />
    <Column
      dataField="Quantity"
      dataType="number"
    />
    <Column
      caption="Amount"
      dataType="number"
      format="currency"
      allowSorting={true}
      calculateCellValue={getAmount}
    />
    <Summary>
      <TotalItem
        column="OrderID"
        summaryType="count"
      />
      <TotalItem
        column="Quantity"
        summaryType="sum"
        displayFormat="{0}"
      />
      <TotalItem
        column="Amount"
        summaryType="sum"
        displayFormat="{0}"
        valueFormat="currency"
      />
    </Summary>
  </DataGrid>
);
const App = () => {
  const [updateFrequency, setUpdateFrequency] = React.useState(100);
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (getOrderCount() > 500000) {
        return;
      }
      for (let i = 0; i < updateFrequency / 20; i += 1) {
        addOrder();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [updateFrequency]);
  const onUpdateFrequencyChanged = (e) => {
    setUpdateFrequency(e.value);
  };
  return (
    <div>
      <DataGrid
        dataSource={dataSource}
        repaintChangesOnly={true}
        columnAutoWidth={true}
        showBorders={true}
      >
        <Paging defaultPageSize={10} />
        <Column
          dataField="ProductName"
          dataType="string"
        />
        <Column
          dataField="UnitPrice"
          dataType="number"
          format="currency"
        />
        <Column
          dataField="OrderCount"
          dataType="number"
        />
        <Column
          dataField="Quantity"
          dataType="number"
        />
        <Column
          dataField="Amount"
          dataType="number"
          format="currency"
        />
        <Summary>
          <TotalItem
            column="ProductName"
            summaryType="count"
          />
          <TotalItem
            column="Amount"
            summaryType="sum"
            displayFormat="{0}"
            valueFormat="currency"
          />
          <TotalItem
            column="OrderCount"
            summaryType="sum"
            displayFormat="{0}"
          />
        </Summary>
        <MasterDetail
          enabled={true}
          render={detailRender}
        ></MasterDetail>
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Update frequency:</span>
          <Slider
            min={10}
            step={10}
            max={5000}
            value={updateFrequency}
            onValueChanged={onUpdateFrequencyChanged}
          >
            <Tooltip
              enabled={true}
              format="#0 per second"
              showMode="always"
              position="top"
            ></Tooltip>
          </Slider>
        </div>
      </div>
    </div>
  );
};
export default App;

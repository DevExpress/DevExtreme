import React from 'react';
import ODataStore from 'devextreme/data/odata/store';
import DataGrid, {
  Column,
  DataGridTypes,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel,
} from 'devextreme-react/data-grid';
import DiscountCell from './DiscountCell.tsx';

const pageSizes = [10, 25, 50, 100];

const dataSourceOptions = {
  store: new ODataStore({
    version: 2,
    url: 'https://js.devexpress.com/Demos/SalesViewer/odata/DaySaleDtoes',
    key: 'Id',
    beforeSend(request) {
      const year = new Date().getFullYear() - 1;
      request.params.startDate = `${year}-05-10`;
      request.params.endDate = `${year}-5-15`;
    },
  }),
};

const App = () => {
  const [collapsed, setCollapsed] = React.useState(true);

  const onContentReady = React.useCallback((e: DataGridTypes.ContentReadyEvent) => {
    if (collapsed) {
      e.component.expandRow(['EnviroCare']);
      setCollapsed(false);
    }
  }, [collapsed]);

  return (
    <DataGrid
      dataSource={dataSourceOptions}
      allowColumnReordering={true}
      rowAlternationEnabled={true}
      showBorders={true}
      width="100%"
      onContentReady={onContentReady}
    >
      <GroupPanel visible={true} />
      <SearchPanel visible={true} highlightCaseSensitive={true} />
      <Grouping autoExpandAll={false} />

      <Column dataField="Product" groupIndex={0} />
      <Column
        dataField="Amount"
        caption="Sale Amount"
        dataType="number"
        format="currency"
        alignment="right"
      />
      <Column
        dataField="Discount"
        caption="Discount %"
        dataType="number"
        format="percent"
        alignment="right"
        allowGrouping={false}
        cellRender={DiscountCell}
        cssClass="bullet"
      />
      <Column dataField="SaleDate" dataType="date" />
      <Column dataField="Region" dataType="string" />
      <Column dataField="Sector" dataType="string" />
      <Column dataField="Channel" dataType="string" />
      <Column dataField="Customer" dataType="string" width={150} />

      <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
      <Paging defaultPageSize={10} />
    </DataGrid>
  );
};

export default App;

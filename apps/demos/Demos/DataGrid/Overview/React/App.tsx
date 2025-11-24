import React, { useCallback, useState } from 'react';
import DataGrid, {
  Column,
  type DataGridTypes,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel,
} from 'devextreme-react/data-grid';
import DiscountCell from './DiscountCell.tsx';
import { sales } from './data.ts';

const pageSizes = [10, 25, 50, 100];

const App = () => {
  const [collapsed, setCollapsed] = useState(true);

  const onContentReady = useCallback((e: DataGridTypes.ContentReadyEvent) => {
    if (collapsed) {
      e.component.expandRow(['EnviroCare']);
      setCollapsed(false);
    }
  }, [collapsed]);

  return (
    <DataGrid
      dataSource={sales}
      keyExpr="Id"
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

      <Pager
        visible={true}
        allowedPageSizes={pageSizes}
        showPageSizeSelector={true}
      />
      <Paging defaultPageSize={10} />
    </DataGrid>
  );
};

export default App;

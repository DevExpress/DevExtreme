import React, { useCallback, useRef } from 'react';

import {
  DataGrid,
  Column,
  Paging,
  MasterDetail,
  type DataGridTypes,
} from 'devextreme-react/data-grid';
import Category from './Category.tsx';
import DetailView from './DetailView.tsx';
import { vehicles } from './data.ts';
import { type Vehicle } from './types.ts';

export default function App() {
  const abortActiveRequest = useRef<() => void>(() => {});

  const onAbortReady = useCallback((abortRequest: () => void) => {
    abortActiveRequest.current = abortRequest;
  }, []);

  const renderDetailView = useCallback((templateData: DataGridTypes.MasterDetailTemplateData) => (
    <DetailView {...templateData} onAbortReady={onAbortReady} />
  ), [onAbortReady]);

  const onRowExpanding = useCallback(({ component }: DataGridTypes.RowExpandingEvent) => {
    abortActiveRequest.current();
    component.collapseAll(-1);
  }, []);

  const onCellClick = useCallback(({ column, row, component, key }: DataGridTypes.CellClickEvent) => {
    if (column.type === 'detailExpand' && row.rowType === 'data') {
      if (row.isExpanded) {
        abortActiveRequest.current();
        component.collapseRow(key);
      } else {
        component.expandRow(key);
      }
    }
  }, []);

  const renderSparkleIcon = useCallback(() => <div className="dx-icon-sparkle" />, []);

  const calculateModel = useCallback((data: Vehicle) => `${data.TrademarkName} ${data.Name}`, []);

  return (
    <DataGrid
      dataSource={vehicles}
      showBorders={true}
      keyExpr="ID"
      height={500}
      onRowExpanding={onRowExpanding}
      onCellClick={onCellClick}
    >
      <Paging pageSize={10} />

      <Column
        type="detailExpand"
        cellRender={renderSparkleIcon}
      />
      <Column
        dataField="Model"
        calculateCellValue={calculateModel}
      />
      <Column
        dataField="Price"
        alignment="left"
        format="currency"
      />
      <Column
        caption="Category"
        minWidth={180}
        cellRender={Category}
      />
      <Column dataField="Modification" />
      <Column dataField="Horsepower" />
      <Column
        dataField="BodyStyleName"
        caption="Body Style"
      />

      <MasterDetail
        enabled={true}
        component={renderDetailView}
      />
    </DataGrid>
  );
}

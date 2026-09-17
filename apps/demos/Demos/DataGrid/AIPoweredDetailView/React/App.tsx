import React, { useCallback, useRef } from 'react';

import { formatMessage } from 'devextreme/localization';
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
import type { Vehicle, AbortRequest } from './types.ts';

export default function App() {
  const activeAbortRequest = useRef<AbortRequest | null>(null);

  const registerAbortRequest = useCallback((abortRequest: AbortRequest) => {
    activeAbortRequest.current = abortRequest;
  }, []);

  const unregisterAbortRequest = useCallback((abortRequest: AbortRequest) => {
    if (activeAbortRequest.current === abortRequest) {
      activeAbortRequest.current = null;
    }
  }, []);

  const renderDetailView = useCallback((templateData: DataGridTypes.MasterDetailTemplateData) => (
    <DetailView
      {...templateData}
      registerAbortRequest={registerAbortRequest}
      unregisterAbortRequest={unregisterAbortRequest}
    />
  ), [registerAbortRequest, unregisterAbortRequest]);

  const onRowExpanding = useCallback(({ component }: DataGridTypes.RowExpandingEvent) => {
    component.collapseAll(-1);
  }, []);

  const onRowCollapsing = useCallback(() => {
    activeAbortRequest.current?.();
  }, []);

  const onCellClick = useCallback(({ column, row, component, key }: DataGridTypes.CellClickEvent) => {
    if (column.type === 'detailExpand' && row.rowType === 'data') {
      if (row.isExpanded) {
        component.collapseRow(key);
      } else {
        component.expandRow(key);
      }
    }
  }, []);

  const onCellPrepared = useCallback(({ rowType, column, cellElement, row }: DataGridTypes.CellPreparedEvent) => {
    if (rowType === 'data' && column.type === 'detailExpand') {
      const ariaLabelCollapse = formatMessage('dxDataGrid-ariaCollapse');
      const ariaLabelExpand = formatMessage('dxDataGrid-ariaExpand');
      const ariaLabel = row.isExpanded ? ariaLabelCollapse : ariaLabelExpand;
      cellElement.setAttribute('aria-label', ariaLabel);
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
      onRowCollapsing={onRowCollapsing}
      onCellClick={onCellClick}
      onCellPrepared={onCellPrepared}
    >
      <Paging pageSize={10} />

      <Column
        type="detailExpand"
        cellRender={renderSparkleIcon}
      />
      <Column
        caption="Model"
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

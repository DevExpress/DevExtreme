import React, { useCallback, useRef } from 'react';
import { formatMessage } from 'devextreme/localization';
import {
  DataGrid, Column, Paging, MasterDetail,
} from 'devextreme-react/data-grid';
import Category from './Category.js';
import DetailView from './DetailView.js';
import { vehicles } from './data.js';

export default function App() {
  const activeAbortRequest = useRef(null);
  const registerAbortRequest = useCallback((abortRequest) => {
    activeAbortRequest.current = abortRequest;
  }, []);
  const unregisterAbortRequest = useCallback((abortRequest) => {
    if (activeAbortRequest.current === abortRequest) {
      activeAbortRequest.current = null;
    }
  }, []);
  const renderDetailView = useCallback(
    (templateData) => (
      <DetailView
        {...templateData}
        registerAbortRequest={registerAbortRequest}
        unregisterAbortRequest={unregisterAbortRequest}
      />
    ),
    [registerAbortRequest, unregisterAbortRequest],
  );
  const onRowExpanding = useCallback(({ component }) => {
    component.collapseAll(-1);
  }, []);
  const onRowCollapsing = useCallback(() => {
    activeAbortRequest.current?.();
    activeAbortRequest.current = null;
  }, []);
  const onCellClick = useCallback(({
    column, row, rowType, component, key,
  }) => {
    if (column.type === 'detailExpand' && rowType === 'data') {
      if (row.isExpanded) {
        component.collapseRow(key);
      } else {
        component.expandRow(key);
      }
    }
  }, []);
  const onCellPrepared = useCallback(({
    rowType, column, cellElement, row,
  }) => {
    if (rowType === 'data' && column.type === 'detailExpand') {
      const ariaLabelCollapse = formatMessage('dxDataGrid-ariaCollapse');
      const ariaLabelExpand = formatMessage('dxDataGrid-ariaExpand');
      const ariaLabel = row.isExpanded ? ariaLabelCollapse : ariaLabelExpand;
      cellElement.setAttribute('aria-label', ariaLabel);
    }
  }, []);
  const renderSparkleIcon = useCallback(() => <div className="dx-icon-sparkle" />, []);
  const calculateModel = useCallback((data) => `${data.TrademarkName} ${data.Name}`, []);
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

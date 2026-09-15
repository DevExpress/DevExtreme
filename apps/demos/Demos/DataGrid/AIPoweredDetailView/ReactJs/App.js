import React, { useCallback, useRef } from 'react';
import {
  DataGrid, Column, Paging, MasterDetail,
} from 'devextreme-react/data-grid';
import { formatMessage } from 'devextreme/localization';
import Category from './Category.js';
import DetailView from './DetailView.js';
import { vehicles } from './data.js';

export default function App() {
  const abortActiveRequest = useRef(() => {});
  const onAbortReady = useCallback((abortRequest) => {
    abortActiveRequest.current = abortRequest;
  }, []);
  const renderDetailView = useCallback(
    (templateData) => (
      <DetailView
        {...templateData}
        onAbortReady={onAbortReady}
      />
    ),
    [onAbortReady],
  );
  const onRowExpanding = useCallback(({ component }) => {
    abortActiveRequest.current();
    component.collapseAll(-1);
  }, []);
  const onCellClick = useCallback(({
    column, row, component, key,
  }) => {
    if (column.type === 'detailExpand' && row.rowType === 'data') {
      if (row.isExpanded) {
        abortActiveRequest.current();
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
      onCellClick={onCellClick}
      onCellPrepared={onCellPrepared}
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

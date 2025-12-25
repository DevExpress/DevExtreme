import React from 'react';
import { jsPDF } from 'jspdf';

import DataGrid, { Column, Export } from 'devextreme-react/data-grid';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import { exportDataGrid } from 'devextreme-react/common/export/pdf';
import type { DataGridExportOptions } from 'devextreme-react/common/export/pdf';

import { employees } from './data.ts';

type RowExportingEvent = Parameters<Required<DataGridExportOptions>['onRowExporting']>[0];
type CustomDrawCellEvent = Parameters<Required<DataGridExportOptions>['customDrawCell']>[0];

const exportFormats = ['pdf'];

const onExporting = ({ component }: DataGridTypes.ExportingEvent) => {
  const doc = new jsPDF();

  exportDataGrid({
    jsPDFDocument: doc,
    component,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    topLeft: { x: 5, y: 5 },
    columnWidths: [30, 30, 30, 30, 30, 30],
    onRowExporting: (e: RowExportingEvent) => {
      const isHeader = e.rowCells?.[0].text === 'Picture';
      if (!isHeader) {
        e.rowHeight = 40;
      }
    },
    customDrawCell: (e: CustomDrawCellEvent) => {
      if (e.gridCell && e.gridCell.rowType === 'data' && e.gridCell.column?.dataField === 'Picture' && e.rect) {
        doc.addImage(e.gridCell.value, 'PNG', e.rect.x, e.rect.y, e.rect.w, e.rect.h);
        e.cancel = true;
      }
    },
  }).then(() => {
    doc.save('DataGrid.pdf');
  });
};

const renderGridCell = (cellData: DataGridTypes.ColumnCellTemplateData) => (
  <div>
    <img src={cellData.value} alt="Employee photo"></img>
  </div>
);

const App = () => (
  <div>
    <DataGrid
      id="gridContainer"
      dataSource={employees}
      keyExpr="ID"
      showBorders={true}
      showRowLines={true}
      showColumnLines={false}
      onExporting={onExporting}>

      <Export enabled={true} formats={exportFormats} />
      <Column dataField="Picture" width={90} cellRender={renderGridCell} />
      <Column dataField="FirstName" />
      <Column dataField="LastName" />
      <Column dataField="Position" />
      <Column dataField="BirthDate" dataType="date" />
      <Column dataField="HireDate" dataType="date" />
    </DataGrid>
  </div>
);

export default App;

import React from 'react';
import DataGrid, { Column, Export } from 'devextreme-react/data-grid';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import service from './data.js';

const exportFormats = ['pdf'];

export default function App() {
  const employees = service.getEmployees();

  const onExporting = React.useCallback((e) => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();

    exportDataGrid({
      jsPDFDocument: doc,
      component: e.component,
      margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
      topLeft: { x: 0, y: 5 },
      columnWidths: [30, 30, 30, 30, 30, 30],
      onRowExporting: (arg) => {
        const isHeader = arg.rowCells[0].text === 'Picture';
        if (!isHeader) {
          arg.rowHeight = 40;
        }
      },
      customDrawCell: (arg) => {
        if (arg.gridCell.rowType === 'data' && arg.gridCell.column.dataField === 'Picture') {
          doc.addImage(arg.gridCell.value, 'PNG', arg.rect.x, arg.rect.y, arg.rect.w, arg.rect.h);
          arg.cancel = true;
        }
      },
    }).then(() => {
      doc.save('DataGrid.pdf');
    });
  }, []);

  const renderGridCell = React.useCallback((cellData) => (
    <div>
      <img src={cellData.value}></img>
    </div>
  ));

  return (
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
}

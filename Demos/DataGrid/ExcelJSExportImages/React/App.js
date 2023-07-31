import React from 'react';
import DataGrid, { Column, Export } from 'devextreme-react/data-grid';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';

import service from './data.js';

const employees = service.getEmployees();

const renderGridCell = (cellData) => (<div><img src={cellData.value}></img></div>);

const onExporting = (e) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Main sheet');

  exportDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled: true,
    topLeftCell: { row: 2, column: 2 },
    customizeCell: ({ gridCell, excelCell }) => {
      if (gridCell.rowType === 'data') {
        if (gridCell.column.dataField === 'Picture') {
          excelCell.value = undefined;

          const image = workbook.addImage({
            base64: gridCell.value,
            extension: 'png',
          });

          worksheet.getRow(excelCell.row).height = 90;
          worksheet.addImage(image, {
            tl: { col: excelCell.col - 1, row: excelCell.row - 1 },
            br: { col: excelCell.col, row: excelCell.row },
          });
        }
      }
    },
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
    });
  });
  e.cancel = true;
};

const App = () => (
  <div>
    <DataGrid
      id="gridContainer"
      dataSource={employees}
      keyExpr="ID"
      showBorders={true}
      showRowLines={true}
      showColumnLines={false}
      onExporting={onExporting}
    >

      <Column dataField="Picture" width={90} cellRender={renderGridCell} />
      <Column dataField="FirstName" />
      <Column dataField="LastName" />
      <Column dataField="Position" />
      <Column dataField="BirthDate" dataType="date" />
      <Column dataField="HireDate" dataType="date" />

      <Export enabled={true} />
    </DataGrid>
  </div>
);

export default App;

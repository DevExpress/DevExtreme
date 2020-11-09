import React from 'react';
import DataGrid, { Column, Export } from 'devextreme-react/data-grid';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import FileSaver from "file-saver";
*/
import { exportDataGrid } from 'devextreme/excel_exporter';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.employees = service.getEmployees();
    this.onExporting = this.onExporting.bind(this);
  }

  render() {
    return (
      <div>
        <DataGrid
          id="gridContainer"
          dataSource={this.employees}
          showBorders={true}
          showRowLines={true}
          showColumnLines={false}
          onExporting={this.onExporting}>

          <Column dataField="Picture" width={90} cellRender={this.renderGridCell} />
          <Column dataField="FirstName" />
          <Column dataField="LastName" />
          <Column dataField="Position" />
          <Column dataField="BirthDate" dataType="date" />
          <Column dataField="HireDate" dataType="date" />

          <Export enabled={true} />
        </DataGrid>
      </div>
    );
  }

  onExporting(e) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      autoFilterEnabled: true,
      topLeftCell: { row: 2, column: 2 },
      customizeCell: ({ gridCell, excelCell }) => {
        if(gridCell.rowType === 'data') {
          if(gridCell.column.dataField === 'Picture') {
            excelCell.value = undefined;

            const image = workbook.addImage({
              base64: gridCell.value,
              extension: 'png',
            });

            worksheet.getRow(excelCell.row).height = 90;
            worksheet.addImage(image, {
              tl: { col: excelCell.col - 1, row: excelCell.row - 1 },
              br: { col: excelCell.col, row: excelCell.row }
            });
          }
        }
      }
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
      });
    });
    e.cancel = true;
  }

  renderGridCell(cellData) {
    return (<div><img src={cellData.value}></img></div>);
  }
}

export default App;

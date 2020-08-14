import React from 'react';

import DataGrid, { Column, Export } from 'devextreme-react/data-grid';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import FileSaver from "file-saver";
*/
import { exportDataGrid } from 'devextreme/excel_exporter';

import { countries } from './data.js';

const gdpFormat = {
  type: 'percent',
  precision: 1
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onExporting = this.onExporting.bind(this);
  }

  render() {
    return (
      <DataGrid
        dataSource={countries}
        showBorders={true}
        onExporting={this.onExporting}
      >
        <Export enabled={true} />

        <Column dataField="Country" />
        <Column dataField="Area" />
        <Column caption="Population">
          <Column
            dataField="Population_Total"
            caption="Total"
            format="fixedPoint"
          />
          <Column
            dataField="Population_Urban"
            caption="Urban"
            format="percent"
          />
        </Column>
        <Column caption="Nominal GDP">
          <Column
            dataField="GDP_Total"
            caption="Total, mln $"
            format="fixedPoint"
            sortOrder="desc"
          />
          <Column caption="By Sector">
            <Column
              dataField="GDP_Agriculture"
              caption="Agriculture"
              format={gdpFormat}
              width={95}
            />
            <Column
              dataField="GDP_Industry"
              caption="Industry"
              format={gdpFormat}
              width={80}
            />
            <Column
              dataField="GDP_Services"
              caption="Services"
              format={gdpFormat}
              width={85}
            />
          </Column>
        </Column>
      </DataGrid>
    );
  }

  onExporting(e) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CountriesPopulation');

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      topLeftCell: { row: 4, column: 1 }
    }).then(function(cellRange) {
      // header
      // https://github.com/exceljs/exceljs#rows
      const headerRow = worksheet.getRow(2);
      headerRow.height = 30;
      // https://github.com/exceljs/exceljs#merged-cells
      worksheet.mergeCells(2, 1, 2, 8);

      // https://github.com/exceljs/exceljs#value-types
      headerRow.getCell(1).value = 'Country Area, Population, and GDP Structure';
      // https://github.com/exceljs/exceljs#fonts
      headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
      // https://github.com/exceljs/exceljs#alignment
      headerRow.getCell(1).alignment = { horizontal: 'center' };

      // footer
      const footerRowIndex = cellRange.to.row + 2;
      const footerRow = worksheet.getRow(footerRowIndex);
      worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 8);

      footerRow.getCell(1).value = 'www.wikipedia.org';
      footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
      footerRow.getCell(1).alignment = { horizontal: 'right' };
    }).then(function() {
      // https://github.com/exceljs/exceljs#writing-xlsx
      workbook.xlsx.writeBuffer().then(function(buffer) {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CountriesPopulation.xlsx');
      });
    });
    e.cancel = true;
  }
}

export default App;

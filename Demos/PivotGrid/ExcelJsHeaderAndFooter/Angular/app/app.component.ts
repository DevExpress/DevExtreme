import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPivotGridModule, DxCheckBoxModule } from 'devextreme-angular';

import { Workbook, WorksheetViewFrozen } from 'exceljs';
import { saveAs } from 'file-saver-es';
// Our demo infrastructure requires us to use 'file-saver-es'. We recommend that you use the official 'file-saver' package in your applications.
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { Service, Sale } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}
@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})

export class AppComponent {
  sales: Sale[];

  dataSource: any;

  exportDataFieldHeaders = false;

  exportRowFieldHeaders = false;

  exportColumnFieldHeaders = false;

  exportFilterFieldHeaders = false;

  constructor(service: Service) {
    this.dataSource = {
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
        expanded: true,
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
        filterValues: [[2013], [2014], [2015]],
        expanded: false,
      }, {
        caption: 'Sales',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      }, {
        caption: 'Country',
        dataField: 'country',
        area: 'filter',
      }],
      store: service.getSales(),
    };
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sales');

    worksheet.columns = [
      { width: 30 }, { width: 20 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 },
    ];

    exportPivotGrid({
      component: e.component,
      worksheet,
      topLeftCell: { row: 4, column: 1 },
      keepColumnWidths: false,
      exportDataFieldHeaders: this.exportDataFieldHeaders,
      exportRowFieldHeaders: this.exportRowFieldHeaders,
      exportColumnFieldHeaders: this.exportColumnFieldHeaders,
      exportFilterFieldHeaders: this.exportFilterFieldHeaders,
    }).then((cellRange) => {
      // Header
      const headerRow = worksheet.getRow(2);
      headerRow.height = 30;

      const columnFromIndex = (worksheet.views[0] as WorksheetViewFrozen).xSplit + 1;
      const columnToIndex = columnFromIndex + 3;
      worksheet.mergeCells(2, columnFromIndex, 2, columnToIndex);
      const headerCell = headerRow.getCell(columnFromIndex);
      headerCell.value = 'Sales Amount by Region';
      headerCell.font = { name: 'Segoe UI Light', size: 22, bold: true };
      headerCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

      // Footer
      const footerRowIndex = cellRange.to.row + 2;
      const footerCell = worksheet.getRow(footerRowIndex).getCell(cellRange.to.column);
      footerCell.value = 'www.wikipedia.org';
      footerCell.font = { color: { argb: 'BFBFBF' }, italic: true };
      footerCell.alignment = { horizontal: 'right' };
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
      });
    });
    e.cancel = true;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxPivotGridModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

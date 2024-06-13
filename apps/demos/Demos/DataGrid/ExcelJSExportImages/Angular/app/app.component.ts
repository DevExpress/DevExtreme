import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Anchor, Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
// Our demo infrastructure requires us to use 'file-saver-es'. We recommend that you use the official 'file-saver' package in your applications.
import { exportDataGrid } from 'devextreme/excel_exporter';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})

export class AppComponent {
  employees: Employee[];

  constructor(service: Service) {
    this.employees = service.getEmployess();
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');

    exportDataGrid({
      component: e.component,
      worksheet,
      topLeftCell: { row: 2, column: 2 },
      autoFilterEnabled: true,
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
              // NOTE: casting these objects to the Anchor type manually because of this issue:
              // https://github.com/exceljs/exceljs/issues/1747
              tl: { col: excelCell.col - 1, row: excelCell.row - 1 } as Anchor,
              br: { col: excelCell.col, row: excelCell.row } as Anchor,
            });
          }
        }
      },
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
      });
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

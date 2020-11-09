import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule } from 'devextreme-angular';
import { Service, Company } from './app.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import * as ExcelJS from "exceljs/dist/exceljs.min.js";
  import * as FileSaver from "file-saver";
*/

if(!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service]
})

export class AppComponent {
  companies: Company[];
  
  constructor(private service: Service) {
    this.companies = service.getCompanies();
  }
  
  onExporting(e) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Companies');

    worksheet.columns = [
      { width: 5 }, { width: 30 }, { width: 25 }, { width: 15 }, { width: 25 }, { width: 40 }
    ];

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      keepColumnWidths: false,
      topLeftCell: { row: 2, column: 2 },
      customizeCell: ({ gridCell, excelCell }) => {        
        if(gridCell.rowType === "data") {
          if(gridCell.column.dataField === 'Phone') {
            excelCell.value = parseInt(gridCell.value);
            excelCell.numFmt = '[<=9999999]###-####;(###) ###-####';
          }
          if(gridCell.column.dataField === 'Website') {
            excelCell.value = { text: gridCell.value, hyperlink: gridCell.value };
            excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
            excelCell.alignment = { horizontal: 'left' };
          }
        }
        if(gridCell.rowType === "group") {
          excelCell.fill = { type: 'pattern', pattern:'solid', fgColor: { argb: "BEDFE6" } };
        }
        if(gridCell.rowType === "totalFooter" && excelCell.value) {
          excelCell.font.italic = true;
        }
      }
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Companies.xlsx");
      });
    });
    e.cancel = true;
  }
  phoneNumberFormat(value) {
    const USNumber = value.match(/(\d{3})(\d{3})(\d{4})/);

    return `(${ USNumber[1] }) ${ USNumber[2] }-${ USNumber[3] }`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
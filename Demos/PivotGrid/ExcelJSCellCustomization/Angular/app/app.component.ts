import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPivotGridModule } from 'devextreme-angular';
import { Service, Sale } from './app.service';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
  import * as FileSaver from 'file-saver';
*/

if(!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  providers: [Service]
})
export class AppComponent {
  sales: Sale[];
  dataSource: any;
  
  constructor(service: Service) {
    this.dataSource = {
      fields: [{
        caption: 'Region',
        dataField: 'region',
        area: 'row'
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row'
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column'
      }, {
        caption: 'Amount',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data'
      }, {
        caption: 'Count',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'count',
        area: 'data'
      }],
      store: service.getSales()
    }
  }
  
  onExporting(e) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales');
    
    exportPivotGrid({
      component: e.component,
      worksheet: worksheet,
      customizeCell: ({ pivotCell, excelCell }) => {
        if(pivotCell.rowType === 'T' || pivotCell.type === 'T' || pivotCell.type === 'GT' || pivotCell.rowType === 'GT' || pivotCell.columnType === 'GT') {
          excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } };
          if(pivotCell.dataIndex === 0) {
            excelCell.numFmt = '$ #,##.#,"K"';
          }
        }
        
        if(pivotCell.area === 'data') {
          if(pivotCell.dataIndex === 1) {
            excelCell.font = { bold: true };
          } else {
            const color = pivotCell.value < 100000 ? 'DC3545' : '28A745';
            excelCell.font = { color: { argb: color } };
          }
        }
        
        const borderStyle = { style: 'thin', color: { argb: 'FF7E7E7E' } };
        excelCell.border = {
          bottom: borderStyle,
          left: borderStyle,
          right: borderStyle,
          top: borderStyle
        };
      }
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
      });
    });
    e.cancel = true;
  }
  
  onCellPrepared({ area, type, rowType, columnType, cellElement, cell }) {
    if(rowType === 'T' || type === 'T' || type === 'GT' || rowType === 'GT' || columnType === 'GT') {
      cellElement.style.backgroundColor = '#DDDDDD';
    }
    if(area === 'data') {
      if(cell.dataIndex === 1) {
        cellElement.style.fontWeight = 'bold';
      } else {
        if(cell.value < 100000) {
          cellElement.style.color = '#DC3545';
        } else {
          cellElement.style.color = '#28A745';
        }
      }
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPivotGridModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
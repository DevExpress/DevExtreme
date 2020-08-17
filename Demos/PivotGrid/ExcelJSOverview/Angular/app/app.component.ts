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
  styleUrls: ['app/app.component.css'],
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
        area: 'row',
        expanded: true
      }, {
        caption: 'City',
        dataField: 'city',
        area: 'row',
        width: 150
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
        expanded: true
      }, {
        caption: 'Sales',
        dataField: 'amount',
        dataType: 'number',
        area: 'data',
        summaryType: 'sum',
        format: 'currency',
      }],
      store: service.getSales()
    }
  }
  
  onExporting(e) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales');
    
    exportPivotGrid({
      component: e.component,
      worksheet: worksheet
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
    DxPivotGridModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
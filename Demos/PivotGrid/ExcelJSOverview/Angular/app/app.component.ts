import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPivotGridModule } from 'devextreme-angular';
import { Service, Sale } from './app.service';
import { exportPivotGrid } from 'devextreme/excel_exporter';
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
    sales: Sale[];
    dataSource: any;

    constructor(service: Service) {
        this.dataSource = {
            fields: [{
                caption: 'Region',
                width: 120,
                dataField: 'region',
                area: 'row'
            }, {
                caption: 'City',
                dataField: 'city',
                width: 150,
                area: 'row',
                selector: this.citySelector
            }, {
                dataField: 'date',
                dataType: 'date',
                area: 'column'
            }, {
                caption: 'Sales',
                dataField: 'amount',
                dataType: 'number',
                summaryType: 'sum',
                format: 'currency',
                area: 'data'
            }],
            store: service.getSales()
        }
    }

    citySelector(data) {
        return data.city + ' (' + data.country + ')';
    }

    onExporting(e) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Employees');
        
        exportPivotGrid({
          component: e.component,
          worksheet: worksheet
        }).then(function() {
          // https://github.com/exceljs/exceljs#writing-xlsx
          workbook.xlsx.writeBuffer().then(function(buffer) {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
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
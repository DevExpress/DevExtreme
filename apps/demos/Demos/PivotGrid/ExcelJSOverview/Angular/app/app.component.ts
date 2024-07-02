import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
// Our demo infrastructure requires us to use 'file-saver-es'. We recommend that you use the official 'file-saver' package in your applications.
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { Options as DataSourceConfig } from 'devextreme/ui/pivot_grid/data_source';
import { DxPivotGridModule, DxPivotGridTypes } from 'devextreme-angular/ui/pivot-grid';
import { Service, Sale } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  sales: Sale[];

  dataSource: DataSourceConfig;

  constructor(service: Service) {
    this.dataSource = {
      fields: [{
        caption: 'Region',
        dataField: 'region',
        area: 'row',
        expanded: true,
      }, {
        caption: 'City',
        dataField: 'city',
        area: 'row',
        width: 150,
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
        expanded: true,
      }, {
        caption: 'Sales',
        dataField: 'amount',
        dataType: 'number',
        area: 'data',
        summaryType: 'sum',
        format: 'currency',
      }],
      store: service.getSales(),
    };
  }

  onExporting(e: DxPivotGridTypes.ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sales');

    exportPivotGrid({
      component: e.component,
      worksheet,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
      });
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPivotGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Options as DataSourceConfig } from 'devextreme/data/data_source';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service } from './app.service';

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
  dataSource: DataSourceConfig;

  constructor(service: Service) {
    this.dataSource = {
      store: service.generateData(100000),
    };
  }

  customizeColumns(columns: DxDataGridTypes.Column[]) {
    columns[0].width = 70;
  }

  onContentReady(e: DxDataGridTypes.ContentReadyEvent) {
    e.component.option('loadPanel.enabled', false);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

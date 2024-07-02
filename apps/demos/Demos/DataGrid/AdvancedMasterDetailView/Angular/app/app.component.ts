import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxDataGridModule, DxFormModule, DxSelectBoxModule, DxTabPanelModule,
} from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import DataSource from 'devextreme/data/data_source';
import { DetailViewComponent } from './detail-view/detail-view.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';

  suppliersData: DataSource;

  constructor() {
    this.suppliersData = new DataSource({
      store: AspNetData.createStore({
        key: 'SupplierID',
        loadUrl: `${this.url}/GetSuppliers`,
      }),
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTabPanelModule,
  ],
  declarations: [AppComponent, DetailViewComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

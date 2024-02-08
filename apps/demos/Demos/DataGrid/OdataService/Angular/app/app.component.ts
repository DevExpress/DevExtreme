import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Options as DataSourceConfig } from 'devextreme/data/data_source';
import 'devextreme/data/odata/store';
import { DxDataGridModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
})
export class AppComponent {
  dataSource: DataSourceConfig = {
    store: {
      type: 'odata',
      version: 2,
      url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
      key: 'Product_ID',
    },
    select: [
      'Product_ID',
      'Product_Name',
      'Product_Cost',
      'Product_Sale_Price',
      'Product_Retail_Price',
      'Product_Current_Inventory',
    ],
    filter: ['Product_Current_Inventory', '>', 0],
  };
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

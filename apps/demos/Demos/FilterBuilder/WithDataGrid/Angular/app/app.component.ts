import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxDataGridModule,
  DxButtonModule,
  DxFilterBuilderModule,
} from 'devextreme-angular';

import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { Service } from './app.service';
import type { Fields, Condition } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})

export class AppComponent {
  dataSource: DataSource;

  fields: Fields;

  filter: Condition;

  gridFilterValue: Condition;

  constructor(service: Service) {
    this.fields = service.getFields();
    this.filter = service.getFilter();
    this.gridFilterValue = this.filter;
    this.dataSource = new DataSource({
      store: new ODataStore({
        version: 2,
        fieldTypes: {
          Product_Cost: 'Decimal',
          Product_Sale_Price: 'Decimal',
          Product_Retail_Price: 'Decimal',
        },
        url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
      }),
      select: [
        'Product_ID',
        'Product_Name',
        'Product_Cost',
        'Product_Sale_Price',
        'Product_Retail_Price',
        'Product_Current_Inventory',
      ],
    });
  }

  buttonClick() {
    this.gridFilterValue = this.filter;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
    DxButtonModule,
    DxFilterBuilderModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

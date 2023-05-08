import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxDataGridModule,
  DxButtonModule,
  DxFilterBuilderModule,
} from 'devextreme-angular';

import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  dataSource: any;

  fields: Array<any>;

  filter: any;

  gridFilterValue: any;

  constructor(service: Service) {
    this.fields = service.getFields();
    this.filter = service.getFilter();
    this.gridFilterValue = this.filter;
    this.dataSource = new DataSource({
      store: new ODataStore({
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
    BrowserTransferStateModule,
    DxDataGridModule,
    DxButtonModule,
    DxFilterBuilderModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

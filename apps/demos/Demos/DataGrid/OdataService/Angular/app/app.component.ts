import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DataSourceOptions as DataSourceConfig } from 'devextreme-angular/common/data';

import { DxDataGridModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  imports: [
    DxDataGridModule,
  ],
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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});

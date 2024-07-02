import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxListModule, DxTemplateModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

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
  templateUrl: `.${modulePrefix}/app.component.html`,
})
export class AppComponent {
  listData = new DataSource({
    store: AspNetData.createStore({
      key: 'ProductID',
      loadUrl: 'https://js.devexpress.com/Demos/Mvc/api/ListData/Orders',
    }),
    sort: 'ProductName',
    group: 'Category.CategoryName',
    paginate: true,
    pageSize: 1,
    filter: ['UnitPrice', '>', 15],
  });
}

@NgModule({
  imports: [
    BrowserModule,
    DxListModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

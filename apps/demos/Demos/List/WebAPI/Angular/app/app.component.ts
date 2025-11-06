import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxListModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

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
})
export class AppComponent {
  listData = new DataSource({
    store: AspNetData.createStore({
      key: 'ProductID',
      loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/ListData',
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
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

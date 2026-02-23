import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import 'anti-forgery';

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
  customersData: AspNetData.CustomStore;

  shippersData: AspNetData.CustomStore;

  dataSource: AspNetData.CustomStore;

  url: string;

  constructor() {
    this.url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridWebApi';

    this.dataSource = AspNetData.createStore({
      key: 'OrderID',
      loadUrl: `${this.url}/Orders`,
      insertUrl: `${this.url}/InsertOrder`,
      updateUrl: `${this.url}/UpdateOrder`,
      deleteUrl: `${this.url}/DeleteOrder`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });

    this.customersData = AspNetData.createStore({
      key: 'Value',
      loadUrl: `${this.url}/CustomersLookup`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });

    this.shippersData = AspNetData.createStore({
      key: 'Value',
      loadUrl: `${this.url}/ShippersLookup`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});

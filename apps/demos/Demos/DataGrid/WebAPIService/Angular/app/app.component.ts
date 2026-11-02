import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import 'anti-forgery';
import { DetailGridComponent } from './detail-grid/detail-grid.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  imports: [
    DxDataGridModule,
    DetailGridComponent,
  ],
})
export class AppComponent {
  private readonly url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridWebApi';

  readonly dataSource = AspNetData.createStore({
    key: 'OrderID',
    loadUrl: `${this.url}/Orders`,
    insertUrl: `${this.url}/InsertOrder`,
    updateUrl: `${this.url}/UpdateOrder`,
    deleteUrl: `${this.url}/DeleteOrder`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  readonly customersData = AspNetData.createStore({
    key: 'Value',
    loadUrl: `${this.url}/CustomersLookup`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  readonly shippersData = AspNetData.createStore({
    key: 'Value',
    loadUrl: `${this.url}/ShippersLookup`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });
}

bootstrapApplication(AppComponent);
